import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/stores/userStore";
import { useProjectStore } from "@/stores/projectStore";

interface AssignTeamDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  selectedUserIds: string[];
  onSubmit: (selectedIds: string[]) => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'team' | 'client';
}

export default function AssignTeamDialog({ 
  isOpen, 
  onClose, 
  projectId,
  selectedUserIds,
  onSubmit
}: AssignTeamDialogProps) {
  const { toast } = useToast();
  const { users } = useUserStore();
  const { projects } = useProjectStore();
  const [selectedUsers, setSelectedUsers] = useState<string[]>(selectedUserIds || []);
  const [projectUsers, setProjectUsers] = useState<User[]>([]);

  useEffect(() => {
    // Filter users who are part of the project
    if (projectId) {
      const project = projects.find(p => p.id === projectId);
      if (project && project.team) {
        setProjectUsers(project.team);
      } else {
        // If no specific team is found, show all users
        setProjectUsers([]);
      }
    } else {
      setProjectUsers([]);
    }
  }, [projectId, projects]);

  useEffect(() => {
    // Update selected users when prop changes
    setSelectedUsers(selectedUserIds || []);
  }, [selectedUserIds]);

  const handleToggleUser = (userId: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSubmit = () => {
    onSubmit(selectedUsers);
    
    toast({
      title: "Team updated",
      description: `Successfully assigned ${selectedUsers.length} team members.`,
    });
    
    onClose();
  };

  if (!projectId) return null;

  // Determine which users to display
  const displayUsers = projectUsers.length > 0 ? projectUsers : users;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-400 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Assign Team Members</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <h3 className="font-medium">Select Team Members</h3>
            <p className="text-sm text-gray-400">Choose who should be assigned to this task</p>
            {projectUsers.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                Showing only members assigned to this project
              </p>
            )}
          </div>
          
          <ScrollArea className="h-[300px] rounded-md border border-white/10 p-4">
            <div className="space-y-4">
              {displayUsers.length === 0 ? (
                <p className="text-gray-400">No team members available</p>
              ) : (
                displayUsers.map(user => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`user-${user.id}`} 
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleToggleUser(user.id)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={`user-${user.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {user.name}
                      </label>
                      <p className="text-sm text-gray-400">
                        {user.email} • {user.role}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} className="border-white/10">
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} className="bg-pulse-600 hover:bg-pulse-700">
            Save Assignments
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
