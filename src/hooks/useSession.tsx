
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useToast } from '@/hooks/use-toast';

interface SessionState {
  sessionStart: Date | null;
  lastActivity: Date | null;
  isActive: boolean;
  inactivityTimeout: number; // in minutes
  idleWarningTimeout: number; // in minutes
  showingWarning: boolean;
  
  // Methods
  startSession: () => void;
  endSession: () => void;
  trackActivity: () => void;
  setInactivityTimeout: (minutes: number) => void;
  showWarning: () => void;
  hideWarning: () => void;
  resetIdleTimer: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessionStart: null,
      lastActivity: null,
      isActive: false,
      inactivityTimeout: 30, // default 30 minutes
      idleWarningTimeout: 25, // default 25 minutes (5 min before timeout)
      showingWarning: false,
      
      startSession: () => set({
        sessionStart: new Date(),
        lastActivity: new Date(),
        isActive: true,
        showingWarning: false
      }),
      
      endSession: () => set({
        sessionStart: null,
        lastActivity: null,
        isActive: false,
        showingWarning: false
      }),
      
      trackActivity: () => {
        const lastActivity = new Date();
        set({ lastActivity, showingWarning: false });
      },
      
      setInactivityTimeout: (minutes) => set({
        inactivityTimeout: minutes,
        idleWarningTimeout: Math.max(1, minutes - 5) // 5 minutes before timeout, minimum 1
      }),
      
      showWarning: () => set({ showingWarning: true }),
      
      hideWarning: () => set({ showingWarning: false }),
      
      resetIdleTimer: () => set({ lastActivity: new Date(), showingWarning: false })
    }),
    {
      name: 'session-storage',
      partialize: (state) => ({
        inactivityTimeout: state.inactivityTimeout,
        idleWarningTimeout: state.idleWarningTimeout,
      }),
    }
  )
);

export function useSession() {
  const sessionStore = useSessionStore();
  const { toast } = useToast();
  
  // Set up event listeners for activity tracking
  React.useEffect(() => {
    if (!sessionStore.isActive) return;
    
    const trackUserActivity = () => {
      sessionStore.trackActivity();
    };
    
    // Track various user activities
    window.addEventListener('mousemove', trackUserActivity);
    window.addEventListener('keydown', trackUserActivity);
    window.addEventListener('click', trackUserActivity);
    window.addEventListener('scroll', trackUserActivity);
    window.addEventListener('touchstart', trackUserActivity);
    
    return () => {
      window.removeEventListener('mousemove', trackUserActivity);
      window.removeEventListener('keydown', trackUserActivity);
      window.removeEventListener('click', trackUserActivity);
      window.removeEventListener('scroll', trackUserActivity);
      window.removeEventListener('touchstart', trackUserActivity);
    };
  }, [sessionStore.isActive]);
  
  // Check for inactivity
  React.useEffect(() => {
    if (!sessionStore.isActive || !sessionStore.lastActivity) return;
    
    // Set up warning timer
    const warningTimerId = setTimeout(() => {
      if (!sessionStore.lastActivity) return;
      
      const idleTime = (new Date().getTime() - sessionStore.lastActivity.getTime()) / (1000 * 60);
      if (idleTime >= sessionStore.idleWarningTimeout && !sessionStore.showingWarning) {
        sessionStore.showWarning();
        toast({
          title: "Session Expiring Soon",
          description: `Your session will expire in ${sessionStore.inactivityTimeout - sessionStore.idleWarningTimeout} minutes due to inactivity.`,
          variant: "default", // Changed from "warning" to "default"
          action: (
            <Button 
              onClick={() => sessionStore.resetIdleTimer()}
              size="sm"
              variant="outline"
            >
              Keep Session Active
            </Button>
          ),
        });
      }
    }, sessionStore.idleWarningTimeout * 60 * 1000);
    
    // Set up logout timer
    const logoutTimerId = setTimeout(() => {
      if (!sessionStore.lastActivity) return;
      
      const idleTime = (new Date().getTime() - sessionStore.lastActivity.getTime()) / (1000 * 60);
      if (idleTime >= sessionStore.inactivityTimeout) {
        sessionStore.endSession();
        toast({
          title: "Session Expired",
          description: "Your session has expired due to inactivity. Please log in again.",
          variant: "destructive",
        });
        // Redirect to login page
        window.location.href = '/login';
      }
    }, sessionStore.inactivityTimeout * 60 * 1000);
    
    return () => {
      clearTimeout(warningTimerId);
      clearTimeout(logoutTimerId);
    };
  }, [
    sessionStore.isActive, 
    sessionStore.lastActivity, 
    sessionStore.inactivityTimeout,
    sessionStore.idleWarningTimeout,
    sessionStore.showingWarning
  ]);
  
  return {
    ...sessionStore,
    getSessionDuration: () => {
      if (!sessionStore.sessionStart || !sessionStore.isActive) return 0;
      return (new Date().getTime() - sessionStore.sessionStart.getTime()) / (1000 * 60); // in minutes
    },
    getIdleTime: () => {
      if (!sessionStore.lastActivity) return 0;
      return (new Date().getTime() - sessionStore.lastActivity.getTime()) / (1000 * 60); // in minutes
    }
  };
}

// Missing Button component import
import { Button } from "@/components/ui/button";
import React from "react";
