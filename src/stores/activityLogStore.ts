
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
  timestamp: Date;
}

interface ActivityLogInput {
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
}

interface ActivityLogStore {
  logs: ActivityLog[];
  loading: boolean;
  error: string | null;
  fetchLogs: (limit?: number) => Promise<void>;
  addLog: (log: ActivityLogInput) => Promise<void>;
  getLogsByEntityType: (entityType: string) => ActivityLog[];
  getLatestLogs: (limit?: number) => ActivityLog[];
}

export const useActivityLogStore = create<ActivityLogStore>((set, get) => ({
  logs: [],
  loading: false,
  error: null,
  
  fetchLogs: async (limit = 50) => {
    set({ loading: true, error: null });
    try {
      const { data: authData } = await supabase.auth.getUser();
      
      if (!authData || !authData.user) {
        throw new Error('No authenticated user found');
      }
      
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      const formattedLogs = (data || []).map((log: any) => ({
        id: log.id,
        userId: log.user_id,
        userName: log.user_name,
        action: log.action,
        entityType: log.entity_type,
        entityId: log.entity_id,
        details: log.details,
        timestamp: new Date(log.created_at)
      }));
      
      set({ logs: formattedLogs, loading: false });
    } catch (error: any) {
      console.error('Error fetching activity logs:', error);
      set({ 
        error: error.message || 'Failed to fetch activity logs', 
        loading: false 
      });
    }
  },
  
  addLog: async (log) => {
    set({ loading: true, error: null });
    try {
      // Get current authenticated user to ensure we're setting the correct user_id
      const { data: authData } = await supabase.auth.getUser();
      
      if (!authData || !authData.user) {
        throw new Error('No authenticated user found');
      }
      
      // Make sure user_id matches the authenticated user
      const logData = {
        user_id: authData.user.id,
        user_name: log.userName,
        action: log.action,
        entity_type: log.entityType,
        entity_id: log.entityId,
        details: log.details
      };
      
      const { error } = await supabase
        .from('activity_logs')
        .insert(logData);
      
      if (error) {
        console.error('Error adding activity log:', error);
        throw error;
      }
      
      // Fetch latest logs to update state
      await get().fetchLogs();
    } catch (error: any) {
      console.error('Error adding activity log:', error);
      set({ 
        error: error.message || 'Failed to add activity log', 
        loading: false 
      });
    }
  },

  // Helper methods
  getLogsByEntityType: (entityType: string) => {
    return get().logs.filter(log => log.entityType === entityType);
  },
  
  getLatestLogs: (limit = 10) => {
    return get().logs.slice(0, limit);
  }
}));
