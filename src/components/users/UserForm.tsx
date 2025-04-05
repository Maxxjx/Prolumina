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
import { motion } from "framer-motion";
import { Check, X, User, Mail, Shield, BadgeCheck, UserCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface User {
  id?: number;
  name: string;
  email: string;
  role: 'admin' | 'team' | 'client';
}

interface UserFormProps {
  initialData?: User;
  onSubmit: (data: Omit<User, 'id'>) => void;
}

export default function UserForm({ initialData, onSubmit }: UserFormProps) {
  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    role: initialData?.role || "client",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update avatar when name changes
  const [avatarText, setAvatarText] = useState(() => 
    formData.name ? formData.name.charAt(0).toUpperCase() : 'U'
  );

  useEffect(() => {
    setAvatarText(formData.name ? formData.name.charAt(0).toUpperCase() : 'U');
  }, [formData.name]);

  const handleChange = (field: keyof Omit<User, 'id'>, value: string) => {
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

  const handleBlur = (field: keyof Omit<User, 'id'>) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    
    // Validate on blur
    validateField(field, formData[field]);
  };

  const validateField = (field: keyof Omit<User, 'id'>, value: string) => {
    let error = '';
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          error = "Name is required";
        } else if (value.trim().length < 2) {
          error = "Name must be at least 2 characters";
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Email is invalid";
        }
        break;
      case 'role':
        if (!value) {
          error = "Role is required";
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
    const fields: (keyof Omit<User, 'id'>)[] = ['name', 'email', 'role'];
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

  const getInputStateIcon = (field: keyof Omit<User, 'id'>) => {
    if (!touched[field]) return null;
    return errors[field] 
      ? <X className="h-4 w-4 text-red-500" /> 
      : <Check className="h-4 w-4 text-green-500" />;
  };

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'admin':
        return <Shield className="h-4 w-4 mr-2 text-pulse-500" />;
      case 'team':
        return <UserCheck className="h-4 w-4 mr-2 text-blue-500" />;
      case 'client':
        return <BadgeCheck className="h-4 w-4 mr-2 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex justify-center mb-2">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Avatar className="w-20 h-20 border-2 border-white/10 bg-gradient-to-br from-pulse-400 to-pulse-600">
            <AvatarFallback className="text-2xl font-bold text-white">
              {avatarText}
            </AvatarFallback>
          </Avatar>
        </motion.div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center text-sm font-medium">
          <User className="h-4 w-4 mr-2 text-gray-400" />
          Full Name
        </Label>
        <div className="relative">
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            placeholder="Enter user's full name"
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
            <X className="h-3 w-3 mr-1" />
            {errors.name}
          </motion.p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center text-sm font-medium">
          <Mail className="h-4 w-4 mr-2 text-gray-400" />
          Email Address
        </Label>
        <div className="relative">
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            placeholder="Enter user's email address"
            className={cn(
              "bg-dark-300 pl-3 pr-9 border transition-colors",
              errors.email && touched.email
                ? "border-red-500/50 focus:border-red-500"
                : touched.email && !errors.email
                ? "border-green-500/50 focus:border-green-500"
                : "border-white/10 focus:border-pulse-500/50"
            )}
          />
          {touched.email && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {getInputStateIcon("email")}
            </div>
          )}
        </div>
        {errors.email && touched.email && (
          <motion.p 
            className="text-red-500 text-xs mt-1 flex items-center" 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <X className="h-3 w-3 mr-1" />
            {errors.email}
          </motion.p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role" className="flex items-center text-sm font-medium">
          <Shield className="h-4 w-4 mr-2 text-gray-400" />
          User Role
        </Label>
        <Select
          value={formData.role}
          onValueChange={(value) => handleChange("role", value as 'admin' | 'team' | 'client')}
          onOpenChange={() => handleBlur("role")}
        >
          <SelectTrigger 
            id="role" 
            className={cn(
              "bg-dark-300 border transition-colors",
              errors.role && touched.role
                ? "border-red-500/50 focus:border-red-500"
                : touched.role && !errors.role
                ? "border-green-500/50 focus:border-green-500"
                : "border-white/10 focus:border-pulse-500/50"
            )}
          >
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent className="bg-dark-300 border-white/10">
            <SelectItem 
              value="admin" 
              className="focus:bg-pulse-600/20 focus:text-pulse-400"
            >
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-pulse-500" />
                Administrator
              </div>
            </SelectItem>
            <SelectItem 
              value="team" 
              className="focus:bg-blue-500/20 focus:text-blue-400"
            >
              <div className="flex items-center">
                <UserCheck className="h-4 w-4 mr-2 text-blue-500" />
                Team Member
              </div>
            </SelectItem>
            <SelectItem 
              value="client" 
              className="focus:bg-green-500/20 focus:text-green-400"
            >
              <div className="flex items-center">
                <BadgeCheck className="h-4 w-4 mr-2 text-green-500" />
                Client
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.role && touched.role && (
          <motion.p 
            className="text-red-500 text-xs mt-1 flex items-center" 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <X className="h-3 w-3 mr-1" />
            {errors.role}
          </motion.p>
        )}
        <div className="bg-dark-300 rounded p-3 border border-white/5 mt-2">
          <div className="flex items-center mb-1">
            {getRoleIcon(formData.role)}
            <span className="text-sm font-medium">
              {formData.role === 'admin' ? 'Administrator' : 
               formData.role === 'team' ? 'Team Member' : 'Client'}
            </span>
          </div>
          <p className="text-xs text-gray-400">
            {formData.role === 'admin' 
              ? 'Full access to all features and settings.'
              : formData.role === 'team'
              ? 'Can manage projects, tasks, and view reports.'
              : 'Limited access to assigned projects and tasks.'
            }
          </p>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
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
          ) : initialData ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  );
}
