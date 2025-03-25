'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { TimeEntry } from '@/lib/data/types';

// Current active time tracking (client-side only, not saved to DB yet)
let activeTimeTracking: {
  userId: string;
  taskId: number;
  description: string;
  startTime: Date;
} | null = null;

// Get all time entries for a user
export function useUserTimeEntries(userId?: string) {
  const { data: session } = useSession();
  const currentUserId = userId || session?.user?.id;

  return useQuery({
    queryKey: ['timeEntries', 'user', currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      
      const response = await fetch(`/api/time-entries?userId=${currentUserId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to fetch time entries');
      }
      
      const data = await response.json();
      return data.timeEntries;
    },
    enabled: !!currentUserId,
  });
}

// Get all time entries for a specific task
export function useTaskTimeEntries(taskId: number) {
  return useQuery({
    queryKey: ['timeEntries', 'task', taskId],
    queryFn: async () => {
      if (!taskId) return [];
      
      const response = await fetch(`/api/time-entries?taskId=${taskId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to fetch task time entries');
      }
      
      const data = await response.json();
      return data.timeEntries;
    },
    enabled: !!taskId,
  });
}

// Get time entries within a date range
export function useTimeEntriesInRange(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ['timeEntries', 'range', startDate, endDate],
    queryFn: async () => {
      if (!startDate || !endDate) return [];
      
      const response = await fetch(`/api/time-entries?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to fetch time entries in range');
      }
      
      const data = await response.json();
      return data.timeEntries;
    },
    enabled: !!(startDate && endDate),
  });
}

// Start time tracking for a task
export function useStartTimeTracking() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  
  const startTracking = ({ taskId, description }: { taskId: number; description: string }) => {
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Store current tracking info
    activeTimeTracking = {
      userId,
      taskId,
      description,
      startTime: new Date(),
    };
    
    return true;
  };
  
  return { startTracking };
}

// Stop time tracking and save the entry
export function useStopTimeTracking() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  
  return useMutation({
    mutationFn: async () => {
      if (!activeTimeTracking || !userId) {
        throw new Error('No active time tracking or user not authenticated');
      }
      
      const endTime = new Date();
      const startTime = activeTimeTracking.startTime;
      const elapsedMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
      
      if (elapsedMinutes <= 0) {
        throw new Error('Tracked time must be greater than zero');
      }
      
      const timeEntryData = {
        taskId: activeTimeTracking.taskId,
        userId,
        description: activeTimeTracking.description,
        minutes: elapsedMinutes,
        date: startTime.toISOString().split('T')[0], // Format as YYYY-MM-DD
      };
      
      const response = await fetch('/api/time-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(timeEntryData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to save time entry');
      }
      
      // Clear active tracking
      const savedTracking = { ...activeTimeTracking };
      activeTimeTracking = null;
      
      const data = await response.json();
      return data.timeEntry;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
    },
  });
}

// Delete a time entry
export function useDeleteTimeEntry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ timeEntryId }: { timeEntryId: number }) => {
      const response = await fetch(`/api/time-entries/${timeEntryId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to delete time entry');
      }
      
      return { id: timeEntryId };
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
    },
  });
}

// Get information about the current active time tracking
export function useActiveTimeEntry() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  
  return useQuery({
    queryKey: ['timeEntries', 'active'],
    queryFn: async () => {
      if (!userId) return null;
      
      // Get from client-side state
      if (activeTimeTracking && activeTimeTracking.userId === userId) {
        const startTime = activeTimeTracking.startTime;
        const now = new Date();
        const elapsedSeconds = Math.round((now.getTime() - startTime.getTime()) / 1000);
        
        return {
          ...activeTimeTracking,
          elapsedSeconds,
          isActive: true,
        };
      }
      
      // Try to get from server
      try {
        const response = await fetch('/api/time-entries/active');
        if (!response.ok) {
          return null;
        }
        
        const data = await response.json();
        if (!data.activeTimeEntry) return null;
        
        const startTime = new Date(data.activeTimeEntry.startTime);
        const now = new Date();
        const elapsedSeconds = Math.round((now.getTime() - startTime.getTime()) / 1000);
        
        // Update local state
        activeTimeTracking = {
          userId,
          taskId: data.activeTimeEntry.taskId,
          description: data.activeTimeEntry.description,
          startTime,
        };
        
        return {
          ...activeTimeTracking,
          elapsedSeconds,
          isActive: true,
        };
      } catch (error) {
        return null;
      }
    },
    refetchInterval: 5000, // Update elapsed time every 5 seconds
  });
}