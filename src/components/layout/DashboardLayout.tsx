
import React from 'react';
import { DashboardSidebar } from '../dashboard/DashboardSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <AnimatePresence mode="wait">
      <div className="flex h-screen bg-dark-300 text-white">
        <DashboardSidebar />
        
        <div className={cn(
          "flex-1 flex flex-col overflow-hidden",
          isMobile && "pt-16" // Add padding top for mobile header
        )}>
          {!isMobile && (
            <header className="bg-dark-400 border-b border-white/5 h-16 flex items-center px-6">
              <motion.h1 
                className="text-xl font-semibold"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {title}
              </motion.h1>
            </header>
          )}
          
          <main className="flex-1 overflow-auto p-4 sm:p-6">
            <motion.div
              className="container mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobile && (
                <h1 className="text-xl font-semibold mb-4">{title}</h1>
              )}
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </AnimatePresence>
  );
};
