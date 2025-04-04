
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardEmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export function DashboardEmptyState({ 
  title, 
  description, 
  actionLabel, 
  onAction 
}: DashboardEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-lg border border-white/5 bg-dark-200/30 text-center">
      <div className="w-16 h-16 rounded-full bg-pulse-600/20 flex items-center justify-center mb-4">
        <Plus className="h-8 w-8 text-pulse-500" />
      </div>
      <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
      <p className="text-gray-400 max-w-md mb-6">{description}</p>
      <Button onClick={onAction}>
        <Plus className="h-4 w-4 mr-2" />
        {actionLabel}
      </Button>
    </div>
  );
}
