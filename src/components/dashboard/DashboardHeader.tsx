
import React from 'react';
import { Search, User, Settings, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  title: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="border-white/10 text-white">
            <Bell className="h-4 w-4 mr-2" />
            Invite
          </Button>
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="h-8 w-8 rounded-full border-2 border-dark-300 bg-pulse-700 flex items-center justify-center overflow-hidden"
              >
                <span className="text-white text-xs">{i}</span>
              </div>
            ))}
            <div className="h-8 w-8 rounded-full border-2 border-dark-300 bg-pulse-500 text-white flex items-center justify-center text-xs">
              +2
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
