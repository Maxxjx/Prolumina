import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Calendar as CalendarIcon, 
  Check, 
  X, 
  Flag, 
  ListTodo, 
  AlignLeft, 
  Users, 
  TagIcon,
  Clock,
  Activity
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useUserStore } from "@/stores/userStore";
import { useTaskStore } from "@/stores/taskStore";
import AssignTeamDialog from "./AssignTeamDialog";
import { z } from "zod";

interface Task {
  id?: string;
  title: string;
  description: string;
  project_id: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date?: Date | null;
  assignees?: string[];
}

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: Omit<Task, 'id'>) => void;
}

const taskSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  project_id: z.string().min(1, { message: "Project is required" }),
  status: z.enum(["todo", "in_progress", "review", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  due_date: z.date().nullable().optional(),
  assignees: z.array(z.string()).optional(),
});

export default function TaskForm({ initialData, onSubmit }: TaskFormProps) {
  const { toast } = useToast();
  const { projects, loadProjects } = useTaskStore();
  const { users, loadUsers } = useUserStore();
  
  const [formData, setFormData] = useState<Omit<Task, 'id'>>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    project_id: initialData?.project_id || "",
    status: initialData?.status || "todo",
    priority: initialData?.priority || "medium",
    due_date: initialData?.due_date || null,
    assignees: initialData?.assignees || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date | null>(initialData?.due_date || null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>(initialData?.assignees || []);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingProjects(true);
      try {
        await loadProjects();
      } catch (error) {
        console.error("Failed to load projects:", error);
        toast({
          title: "Error",
          description: "Failed to load projects. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProjects(false);
      }
    };

    loadData();
  }, [loadProjects, toast]);

  useEffect(() => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        due_date: date
      }));
    }
  }, [date]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      assignees: selectedUsers
    }));
  }, [selectedUsers]);

  const handleChange = (field: keyof Omit<Task, 'id'>, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Mark field as touched
    if (!touched[field]) {
      setTouched(prev => ({
        ...prev,
        [field]: true
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleBlur = (field: keyof Omit<Task, 'id'>) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    
    // Validate on blur
    validateField(field, formData[field]);
  };

  const validateField = (field: keyof Omit<Task, 'id'>, value: any) => {
    try {
      // Create a partial schema just for this field
      const partialSchema = z.object({
        [field]: taskSchema.shape[field as keyof typeof taskSchema.shape]
      });
      
      partialSchema.parse({ [field]: value });
      
      // Clear error if validation passes
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
      
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find(err => err.path[0] === field);
        if (fieldError) {
          setErrors(prev => ({
            ...prev,
            [field]: fieldError.message
          }));
        }
      }
      return false;
    }
  };

  const validateForm = () => {
    try {
      taskSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        const newTouched: Record<string, boolean> = {};
        
        error.errors.forEach(err => {
          const field = err.path[0] as string;
          newErrors[field] = err.message;
          newTouched[field] = true;
        });
        
        setErrors(newErrors);
        setTouched(prev => ({
          ...prev,
          ...newTouched
        }));
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    if (validateForm()) {
      try {
        await onSubmit(formData);
        toast({
          title: initialData ? "Task Updated" : "Task Created",
          description: initialData ? "Your task has been updated successfully." : "Your task has been created successfully.",
        });
      } catch (error) {
        console.error('Error submitting form:', error);
        toast({
          title: "Error",
          description: "There was a problem saving your task. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  const getInputStateIcon = (field: keyof Omit<Task, 'id'>) => {
    if (!touched[field]) return null;
    return errors[field] 
      ? <X className="h-4 w-4 text-red-500" /> 
      : <Check className="h-4 w-4 text-green-500" />;
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'low':
        return 'bg-blue-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'high':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'todo':
        return 'bg-gray-500 text-white';
      case 'in_progress':
        return 'bg-blue-500 text-white';
      case 'review':
        return 'bg-yellow-500 text-white';
      case 'done':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleUsersSelected = (selectedIds: string[]) => {
    setSelectedUsers(selectedIds);
    setShowDialog(false);
  };

  const getAssignedUserNames = () => {
    if (!selectedUsers.length) return [];
    return selectedUsers.map(id => {
      const user = users.find(u => u.id === id);
      return user ? user.name : "Unknown User";
    });
  };

  const getProjectName = (id: string) => {
    const project = projects.find(p => p.id === id);
    return project ? project.name : "Unknown Project";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title" className="flex items-center text-sm font-medium">
          <ListTodo className="h-4 w-4 mr-2 text-gray-400" />
          Task Title
        </Label>
        <div className="relative">
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            onBlur={() => handleBlur("title")}
            placeholder="Enter task title"
            className={cn(
              "bg-dark-300 pl-3 pr-9 border transition-colors",
              errors.title && touched.title
                ? "border-red-500/50 focus:border-red-500"
                : touched.title && !errors.title
                ? "border-green-500/50 focus:border-green-500"
                : "border-white/10 focus:border-pulse-500/50"
            )}
          />
          {touched.title && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {getInputStateIcon("title")}
            </div>
          )}
        </div>
        {errors.title && touched.title && (
          <motion.p 
            className="text-red-500 text-xs mt-1 flex items-center" 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <X className="h-3 w-3 mr-1" />
            {errors.title}
          </motion.p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="flex items-center text-sm font-medium">
          <AlignLeft className="h-4 w-4 mr-2 text-gray-400" />
          Task Description
        </Label>
        <div className="relative">
                <Textarea 
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            onBlur={() => handleBlur("description")}
                  placeholder="Describe the task in detail" 
            className={cn(
              "bg-dark-300 min-h-[100px] resize-y pl-3 pr-9 border transition-colors",
              errors.description && touched.description
                ? "border-red-500/50 focus:border-red-500"
                : touched.description && !errors.description
                ? "border-green-500/50 focus:border-green-500"
                : "border-white/10 focus:border-pulse-500/50"
            )}
          />
          {touched.description && (
            <div className="absolute right-3 top-4">
              {getInputStateIcon("description")}
            </div>
          )}
        </div>
        {errors.description && touched.description && (
          <motion.p 
            className="text-red-500 text-xs mt-1 flex items-center" 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <X className="h-3 w-3 mr-1" />
            {errors.description}
          </motion.p>
        )}
        <div className="text-xs text-gray-400 flex items-center mt-1">
          <span className={formData.description.length < 10 ? "text-red-400" : "text-green-400"}>
            {formData.description.length}
          </span>
          <span className="mx-1">/</span>
          <span>10+ characters recommended</span>
        </div>
      </div>
      
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="project_id" className="flex items-center text-sm font-medium">
            <TagIcon className="h-4 w-4 mr-2 text-gray-400" />
            Project
          </Label>
          <Select
            value={formData.project_id}
            onValueChange={(value) => handleChange("project_id", value)}
            onOpenChange={() => handleBlur("project_id")}
            disabled={isLoadingProjects}
          >
            <SelectTrigger 
              id="project_id" 
              className={cn(
                "bg-dark-300 border transition-colors",
                errors.project_id && touched.project_id
                  ? "border-red-500/50 focus:border-red-500"
                  : touched.project_id && !errors.project_id
                  ? "border-green-500/50 focus:border-green-500"
                  : "border-white/10 focus:border-pulse-500/50"
              )}
            >
              {isLoadingProjects ? (
                <div className="flex items-center">
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading projects...
                </div>
              ) : (
                <SelectValue placeholder="Select project" />
              )}
            </SelectTrigger>
            <SelectContent className="bg-dark-300 border-white/10 max-h-[300px]">
              {projects.length === 0 ? (
                <div className="p-2 text-sm text-gray-400">No projects available</div>
              ) : (
                projects.map((project) => (
                  <SelectItem 
                    key={project.id} 
                    value={project.id} 
                    className="focus:bg-pulse-600/20 focus:text-pulse-400"
                  >
                    <div className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                      {project.name}
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.project_id && touched.project_id && (
            <motion.p 
              className="text-red-500 text-xs mt-1 flex items-center" 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <X className="h-3 w-3 mr-1" />
              {errors.project_id}
            </motion.p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status" className="flex items-center text-sm font-medium">
            <Activity className="h-4 w-4 mr-2 text-gray-400" />
            Status
          </Label>
                <Select 
            value={formData.status}
            onValueChange={(value) => handleChange("status", value as 'todo' | 'in_progress' | 'review' | 'done')}
            onOpenChange={() => handleBlur("status")}
          >
            <SelectTrigger 
              id="status" 
              className={cn(
                "bg-dark-300 border transition-colors",
                errors.status && touched.status
                  ? "border-red-500/50 focus:border-red-500"
                  : touched.status && !errors.status
                  ? "border-green-500/50 focus:border-green-500"
                  : "border-white/10 focus:border-pulse-500/50"
              )}
            >
              <SelectValue placeholder="Select status" />
                    </SelectTrigger>
            <SelectContent className="bg-dark-300 border-white/10">
              <SelectItem value="todo" className="focus:bg-gray-500/20 focus:text-gray-400">
                <div className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-gray-500 mr-2"></span>
                  Todo
                </div>
              </SelectItem>
              <SelectItem value="in_progress" className="focus:bg-blue-500/20 focus:text-blue-400">
                <div className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                  In Progress
                </div>
              </SelectItem>
              <SelectItem value="review" className="focus:bg-yellow-500/20 focus:text-yellow-400">
                <div className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                  Review
                </div>
              </SelectItem>
              <SelectItem value="done" className="focus:bg-green-500/20 focus:text-green-400">
                <div className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  Done
                </div>
              </SelectItem>
                  </SelectContent>
                </Select>
        </div>
      </div>
      
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="priority" className="flex items-center text-sm font-medium">
            <Flag className="h-4 w-4 mr-2 text-gray-400" />
            Priority
          </Label>
                <Select 
            value={formData.priority}
            onValueChange={(value) => handleChange("priority", value as 'low' | 'medium' | 'high')}
            onOpenChange={() => handleBlur("priority")}
          >
            <SelectTrigger 
              id="priority" 
              className={cn(
                "bg-dark-300 border transition-colors",
                errors.priority && touched.priority
                  ? "border-red-500/50 focus:border-red-500"
                  : touched.priority && !errors.priority
                  ? "border-green-500/50 focus:border-green-500"
                  : "border-white/10 focus:border-pulse-500/50"
              )}
            >
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
            <SelectContent className="bg-dark-300 border-white/10">
              <SelectItem value="low" className="focus:bg-blue-500/20 focus:text-blue-400">
                <div className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                  Low
                </div>
              </SelectItem>
              <SelectItem value="medium" className="focus:bg-yellow-500/20 focus:text-yellow-400">
                <div className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                  Medium
                </div>
              </SelectItem>
              <SelectItem value="high" className="focus:bg-red-500/20 focus:text-red-400">
                <div className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                  High
                </div>
              </SelectItem>
                  </SelectContent>
                </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="due_date" className="flex items-center text-sm font-medium">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            Due Date
          </Label>
                <Popover>
                  <PopoverTrigger asChild>
                      <Button
                id="due_date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-dark-300 border-white/10 hover:bg-dark-200",
                  !date && "text-muted-foreground"
                )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Select due date</span>}
                      </Button>
                  </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-dark-300 border-white/10" align="start">
                    <Calendar
                      mode="single"
                selected={date || undefined}
                onSelect={setDate}
                      initialFocus
                className="bg-dark-300"
                    />
                  </PopoverContent>
                </Popover>
          <p className="text-xs text-gray-400 mt-1">
            {date ? (
              <span className={
                new Date().getTime() > date.getTime() 
                  ? "text-red-400" 
                  : Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 3
                  ? "text-yellow-400"
                  : "text-green-400"
              }>
                {new Date().getTime() > date.getTime() 
                  ? "Overdue" 
                  : `Due in ${Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`}
              </span>
            ) : (
              "No due date set (optional)"
            )}
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="flex items-center text-sm font-medium mb-2">
          <Users className="h-4 w-4 mr-2 text-gray-400" />
          Assigned Team Members
        </Label>
        
            <Button
              type="button"
              variant="outline"
          className="w-full justify-between text-left bg-dark-300 border-white/10 hover:bg-dark-200"
          onClick={() => setShowDialog(true)}
        >
          <span>
            {selectedUsers.length === 0 
              ? "Assign team members" 
              : `${selectedUsers.length} member${selectedUsers.length === 1 ? '' : 's'} assigned`}
          </span>
          <Users className="h-4 w-4" />
            </Button>
        
        {selectedUsers.length > 0 && (
          <motion.div 
            className="flex flex-wrap gap-2 mt-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {getAssignedUserNames().map((name, index) => (
              <Badge key={index} variant="secondary" className="bg-dark-200 text-white/80">
                {name}
              </Badge>
            ))}
          </motion.div>
        )}
      </div>
      
      {formData.project_id && (
        <div className="mt-6 pt-2 border-t border-white/5">
          <div className="bg-dark-300/50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(formData.status).replace('text-', 'bg-')}`}></span>
                <span className="text-sm font-medium">
                  {formData.title || "Task title"}
                </span>
              </div>
              <Badge className={getPriorityColor(formData.priority)}>
                {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
              </Badge>
            </div>
            <p className="text-xs text-gray-400 mb-2">
              Project: {getProjectName(formData.project_id)}
            </p>
            {date && (
              <div className="flex items-center text-xs text-gray-400">
                <CalendarIcon className="h-3 w-3 mr-1" />
                <span>Due {format(date, "PPP")}</span>
              </div>
            )}
            {selectedUsers.length > 0 && (
              <div className="flex items-center text-xs text-gray-400 mt-1">
                <Users className="h-3 w-3 mr-1" />
                <span>{selectedUsers.length} assignee{selectedUsers.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="flex justify-end gap-3 pt-2">
        <Button 
          type="submit" 
          className="bg-pulse-600 hover:bg-pulse-700 transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : initialData ? "Update Task" : "Create Task"}
        </Button>
      </div>
      
      <AnimatePresence>
        {showDialog && (
      <AssignTeamDialog
            projectId={formData.project_id} 
            isOpen={showDialog} 
            onClose={() => setShowDialog(false)}
            onSubmit={handleUsersSelected}
            selectedUserIds={selectedUsers}
          />
        )}
      </AnimatePresence>
    </form>
  );
}
