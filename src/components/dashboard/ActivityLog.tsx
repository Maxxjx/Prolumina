
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useActivityLogStore } from '@/stores/activityLogStore';
import { 
  ClipboardList, 
  UserPlus, 
  FolderPlus, 
  AlertCircle, 
  Edit, 
  LogIn, 
  LogOut,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface ActivityLogProps {
  limit?: number;
  maxHeight?: string;
  showHeader?: boolean;
  entityType?: 'user' | 'task' | 'project' | 'system';
  className?: string;
}

export default function ActivityLog({ 
  limit = 10, 
  maxHeight = '400px', 
  showHeader = true,
  entityType,
  className = ""
}: ActivityLogProps) {
  const { logs, getLogsByEntityType, getLatestLogs } = useActivityLogStore();
  
  const displayLogs = entityType 
    ? getLogsByEntityType(entityType).slice(0, limit)
    : getLatestLogs(limit);

  // Helper function to get icon for action type
  const getActionIcon = (action: string, entityType: string) => {
    switch(true) {
      case action.includes('Created') && entityType === 'project':
        return <FolderPlus className="h-4 w-4 text-green-500" />;
      case action.includes('Added') && entityType === 'user':
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      case action.includes('Assigned') && entityType === 'task':
        return <ClipboardList className="h-4 w-4 text-purple-500" />;
      case action.includes('Updated'):
        return <Edit className="h-4 w-4 text-orange-500" />;
      case action.includes('Login'):
        return <LogIn className="h-4 w-4 text-green-500" />;
      case action.includes('Logout'):
        return <LogOut className="h-4 w-4 text-gray-500" />;
      case action.includes('Completed'):
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  // Format time difference
  const formatTimeDiff = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMin > 0) return `${diffMin}m ago`;
    return 'Just now';
  };

  return (
    <div className={`rounded-lg bg-card shadow-sm border ${className}`}>
      {showHeader && (
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h3 className="text-sm font-medium">Activity Log</h3>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      
      <ScrollArea className={`p-4`} style={{ maxHeight }}>
        {displayLogs.length > 0 ? (
          <div className="space-y-4">
            {displayLogs.map((log) => (
              <div 
                key={log.id} 
                className="flex items-start gap-3 text-sm p-2 hover:bg-muted/50 rounded-md transition-colors animate-fade-in"
              >
                <div className="mt-0.5">
                  {getActionIcon(log.action, log.entityType)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-sm">{log.action}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatTimeDiff(log.timestamp)}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs">{log.details}</p>
                  <p className="text-xs text-muted-foreground">
                    by <span className="text-foreground">{log.userName}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No activity recorded yet
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
