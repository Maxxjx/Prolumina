'use client';

import { useQuery } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';

// GET summary analytics
export function useSummaryAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: async () => {
      const response = await fetch('/api/analytics?type=summary');
      if (!response.ok) throw new Error('Failed to fetch summary analytics');
      return response.json();
    }
  });
}

// GET project status analytics
export function useProjectStatusAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'project-status'],
    queryFn: async () => {
      const response = await fetch('/api/analytics?type=project-status');
      if (!response.ok) throw new Error('Failed to fetch project status analytics');
      return response.json();
    }
  });
}

// GET task status analytics
export function useTaskStatusAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'task-status'],
    queryFn: async () => {
      const response = await fetch('/api/analytics?type=task-status');
      if (!response.ok) throw new Error('Failed to fetch task status analytics');
      return response.json();
    }
  });
}

// GET user tasks analytics
export function useUserTasksAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'user-tasks'],
    queryFn: async () => {
      const response = await fetch('/api/analytics?type=user-tasks');
      if (!response.ok) throw new Error('Failed to fetch user tasks analytics');
      return response.json();
    }
  });
}

// GET time tracking analytics
export function useTimeTrackingAnalytics(days: number = 30) {
  const endDate = new Date();
  const startDate = subDays(endDate, days);

  return useQuery({
    queryKey: ['analytics', 'time-tracking', days],
    queryFn: async () => {
      const response = await fetch(
        `/api/analytics?type=time-tracking&startDate=${format(startDate, 'yyyy-MM-dd')}&endDate=${format(endDate, 'yyyy-MM-dd')}`
      );
      if (!response.ok) throw new Error('Failed to fetch time tracking analytics');
      return response.json();
    }
  });
}

// GET budget analytics
export function useBudgetAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'budget'],
    queryFn: async () => {
      const response = await fetch('/api/analytics?type=budget');
      if (!response.ok) throw new Error('Failed to fetch budget analytics');
      return response.json();
    }
  });
}

// GET recent activity
export function useRecentActivity(limit: number = 10) {
  return useQuery({
    queryKey: ['analytics', 'recent-activity', limit],
    queryFn: async () => {
      const response = await fetch(`/api/analytics?type=recent-activity&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch recent activity');
      return response.json();
    }
  });
} 