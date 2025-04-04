
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useTaskStore } from '@/stores/taskStore';
import { useUserStore } from '@/stores/userStore';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import TaskForm from '@/components/tasks/TaskForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'team' | 'client';
}

const Tasks = () => {
  const { tasks, fetchTasks } = useTaskStore();
  const { users } = useUserStore();
  const { user } = useAuth();
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    let filtered = [...tasks];
    
    console.log('Tasks from store:', tasks);
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(term) || 
        task.description.toLowerCase().includes(term) ||
        getProjectName(task.projectId).toLowerCase().includes(term)
      );
    }

    // If not admin, only show tasks assigned to current user
    if (user && user.role !== 'admin' && user.id) {
      filtered = filtered.filter(task => 
        task.assignedTo.some((member: User) => member.id === user.id)
      );
    }
    
    setFilteredTasks(filtered);
  }, [tasks, statusFilter, searchTerm, user]);

  // Helper function to get project name from projectId
  const getProjectName = (projectId: string): string => {
    // This should ideally come from projects data
    switch(projectId) {
      case "1": return "Website Redesign";
      case "2": return "Mobile App Development";
      case "3": return "CMS Migration";
      default: return "Project";
    }
  };

  return (
    <DashboardLayout title="All Tasks">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">In Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button variant="default">Create New Task</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <TaskForm 
                onTaskCreated={() => {
                  setIsFormOpen(false);
                  fetchTasks(); // Refresh tasks after creating a new one
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
          <div className="w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Task</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Assigned To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map(task => (
                    <TableRow key={task.id} className="transition-colors hover:bg-muted/50 group">
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">{task.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            task.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                            task.status === 'in-progress' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                            task.status === 'review' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                            'bg-gray-500/10 text-gray-500 border-gray-500/20'
                          }
                        >
                          {task.status === 'todo' ? 'To Do' : 
                           task.status === 'in-progress' ? 'In Progress' : 
                           task.status === 'review' ? 'In Review' : 
                           'Completed'}
                        </Badge>
                      </TableCell>
                      <TableCell>{getProjectName(task.projectId)}</TableCell>
                      <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex -space-x-2">
                          {task.assignedTo && task.assignedTo.slice(0, 3).map((member: User) => (
                            <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {member.name ? member.name.charAt(0) : 'U'}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {task.assignedTo && task.assignedTo.length > 3 && (
                            <Avatar className="h-8 w-8 border-2 border-background">
                              <AvatarFallback className="bg-muted text-muted-foreground">
                                +{task.assignedTo.length - 3}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No tasks found. Try adjusting your filters or create a new task.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tasks;
