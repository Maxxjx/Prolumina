import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { 
  Check, 
  X, 
  Calendar as CalendarIcon,
  Briefcase,
  FileText,
  Timer,
  BarChart3,
  ClipboardCheck,
  AlertCircle
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface Project {
  id?: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  deadline?: Date | null;
  progress: number;
}

interface ProjectFormProps {
  initialData?: Project;
  onSubmit: (data: Omit<Project, 'id'>) => void;
}

export default function ProjectForm({ initialData, onSubmit }: ProjectFormProps) {
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    status: initialData?.status || "active",
    deadline: initialData?.deadline || null,
    progress: initialData?.progress || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date | null>(initialData?.deadline || null);

  useEffect(() => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        deadline: date
      }));
    }
  }, [date]);

  const handleChange = (field: keyof Omit<Project, 'id'>, value: any) => {
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

  const handleBlur = (field: keyof Omit<Project, 'id'>) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    
    // Validate on blur
    validateField(field, formData[field]);
  };

  const validateField = (field: keyof Omit<Project, 'id'>, value: any) => {
    let error = '';
    
    switch (field) {
      case 'name':
        if (!value || !value.trim()) {
          error = "Project name is required";
        } else if (value.trim().length < 3) {
          error = "Project name must be at least 3 characters";
        }
        break;
      case 'description':
        if (!value || !value.trim()) {
          error = "Project description is required";
        } else if (value.trim().length < 10) {
          error = "Description must be at least 10 characters";
        }
        break;
      case 'status':
        if (!value) {
          error = "Status is required";
        }
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
    
    return !error;
  };

  const validateForm = () => {
    const fields: (keyof Omit<Project, 'id'>)[] = ['name', 'description', 'status'];
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};
    
    let isValid = true;
    
    fields.forEach(field => {
      newTouched[field] = true;
      const fieldValid = validateField(field, formData[field]);
      if (!fieldValid) {
        isValid = false;
        newErrors[field] = errors[field] || `${field.charAt(0).toUpperCase() + field.slice(1)} is invalid`;
      }
    });
    
    setTouched(newTouched);
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    if (validateForm()) {
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  const getInputStateIcon = (field: keyof Omit<Project, 'id'>) => {
    if (!touched[field]) return null;
    return errors[field] 
      ? <X className="h-4 w-4 text-red-500" /> 
      : <Check className="h-4 w-4 text-green-500" />;
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active':
        return 'text-blue-500';
      case 'completed':
        return 'text-green-500';
      case 'on-hold':
        return 'text-yellow-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress < 25) return 'from-red-500 to-red-400';
    if (progress < 50) return 'from-yellow-500 to-yellow-400';
    if (progress < 75) return 'from-blue-500 to-blue-400';
    return 'from-green-500 to-green-400';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center text-sm font-medium">
          <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
          Project Name
        </Label>
        <div className="relative">
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            placeholder="Enter project name"
            className={cn(
              "bg-dark-300 pl-3 pr-9 border transition-colors",
              errors.name && touched.name
                ? "border-red-500/50 focus:border-red-500"
                : touched.name && !errors.name
                ? "border-green-500/50 focus:border-green-500"
                : "border-white/10 focus:border-pulse-500/50"
            )}
          />
          {touched.name && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {getInputStateIcon("name")}
            </div>
          )}
        </div>
        {errors.name && touched.name && (
          <motion.p 
            className="text-red-500 text-xs mt-1 flex items-center" 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors.name}
          </motion.p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="flex items-center text-sm font-medium">
          <FileText className="h-4 w-4 mr-2 text-gray-400" />
          Project Description
        </Label>
        <div className="relative">
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            onBlur={() => handleBlur("description")}
            placeholder="Describe the project and its goals"
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
            <AlertCircle className="h-3 w-3 mr-1" />
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
          <Label htmlFor="status" className="flex items-center text-sm font-medium">
            <ClipboardCheck className="h-4 w-4 mr-2 text-gray-400" />
            Project Status
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleChange("status", value as 'active' | 'completed' | 'on-hold' | 'cancelled')}
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
              <SelectItem value="active" className="focus:bg-blue-500/20 focus:text-blue-400">
                <div className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                  Active
                </div>
              </SelectItem>
              <SelectItem value="completed" className="focus:bg-green-500/20 focus:text-green-400">
                <div className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  Completed
                </div>
              </SelectItem>
              <SelectItem value="on-hold" className="focus:bg-yellow-500/20 focus:text-yellow-400">
                <div className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                  On Hold
                </div>
              </SelectItem>
              <SelectItem value="cancelled" className="focus:bg-red-500/20 focus:text-red-400">
                <div className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                  Cancelled
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.status && touched.status && (
            <motion.p 
              className="text-red-500 text-xs mt-1 flex items-center" 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.status}
            </motion.p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="deadline" className="flex items-center text-sm font-medium">
            <Timer className="h-4 w-4 mr-2 text-gray-400" />
            Project Deadline
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="deadline"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-dark-300 border-white/10 hover:bg-dark-200",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Select deadline</span>}
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
              <>Deadline in {Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days</>
            ) : (
              "No deadline set (optional)"
            )}
          </p>
        </div>
      </div>
      
      <div className="space-y-2 pt-2">
        <Label className="flex items-center text-sm font-medium">
          <BarChart3 className="h-4 w-4 mr-2 text-gray-400" />
          Project Progress ({formData.progress}%)
        </Label>
        <div className="pt-2">
          <Slider
            defaultValue={[formData.progress]}
            max={100}
            step={5}
            onValueChange={(value) => handleChange("progress", value[0])}
          />
        </div>
        <div className="w-full bg-dark-300 h-3 rounded-full mt-2 overflow-hidden">
          <motion.div 
            className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(formData.progress)}`}
            initial={{ width: 0 }}
            animate={{ width: `${formData.progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Not Started</span>
          <span>In Progress</span>
          <span>Completed</span>
        </div>
      </div>
      
      <div className="mt-6 pt-2 border-t border-white/5">
        <div className="bg-dark-300/50 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <span className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(formData.status).replace('text-', 'bg-')}`}></span>
            <span className={getStatusColor(formData.status)}>
              {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)} Project
            </span>
          </h3>
          <p className="text-sm text-white/80 mb-3 line-clamp-2">{formData.name || "Project title"}</p>
          {date && (
            <div className="flex items-center text-xs text-gray-400">
              <CalendarIcon className="h-3 w-3 mr-1" />
              <span>Due {format(date, "PPP")}</span>
            </div>
          )}
        </div>
      </div>
      
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
          ) : initialData ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
