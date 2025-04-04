
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
  project: any;
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
  project 
}: AssignTeamDialogProps) {
  const { toast } = useToast();
  const { users } = useUserStore();
  const { updateProjectTeam } = useProjectStore();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    if (project && project.team) {
      setSelectedUsers(project.team.map((member: User) => member.id));
    } else {
      setSelectedUsers([]);
    }
  }, [project]);

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
    if (!project) return;
    
    // Pass the user IDs (strings) instead of User objects
    updateProjectTeam(project.id, selectedUsers);
    
    toast({
      title: "Team updated",
      description: `Successfully assigned ${selectedUsers.length} team members to project.`,
    });
    
    onClose();
  };

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-400 border-white/10 text-white max-w-md w-full sm:max-w-lg md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Assign Team to Project</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <h3 className="font-medium">Project: {project.name}</h3>
            <p className="text-sm text-gray-400">Select team members to assign to this project</p>
          </div>
          
          <ScrollArea className="h-[300px] rounded-md border border-white/10 p-4">
            <div className="space-y-4">
              {users.length === 0 ? (
                <p className="text-gray-400">No team members available</p>
              ) : (
                users.map(user => (
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
