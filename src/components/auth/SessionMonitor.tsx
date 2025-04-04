
import React, { useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { useAuth } from '@/hooks/useAuth';
import { useActivityLogStore } from '@/stores/activityLogStore';

export function SessionMonitor() {
  const { isAuthenticated, user, logout } = useAuth();
  const session = useSession();
  const { addLog } = useActivityLogStore();
  
  // Start session when authenticated
  useEffect(() => {
    if (isAuthenticated && !session.isActive) {
      session.startSession();
      
      // Log session start
      if (user) {
        addLog({
          action: 'Login',
          userId: String(user.id || ''),
          userName: user.name || user.email,
          details: 'User logged in',
          entityType: 'system'
        });
      }
    }
  }, [isAuthenticated, session.isActive]);
  
  // Log session end on unmount if active
  useEffect(() => {
    return () => {
      if (session.isActive && user) {
        addLog({
          action: 'Logout',
          userId: String(user.id || ''),
          userName: user.name || user.email,
          details: 'User logged out',
          entityType: 'system'
        });
      }
    };
  }, [session.isActive, user]);
  
  // Handle logout
  useEffect(() => {
    if (!isAuthenticated && session.isActive) {
      session.endSession();
    }
  }, [isAuthenticated, session.isActive]);
  
  // No UI is rendered
  return null;
}

export default SessionMonitor;
