
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail } from 'lucide-react';

interface ResponsiveLoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function ResponsiveLoginForm({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onSubmit
}: ResponsiveLoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            id="email" 
            type="email" 
            placeholder="name@example.com" 
            className="bg-dark-300/50 border border-white/10 pl-10 text-white placeholder:text-gray-500 h-11"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-white">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            id="password" 
            type="password" 
            placeholder="••••••••" 
            className="bg-dark-300/50 border border-white/10 pl-10 text-white placeholder:text-gray-500 h-11"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>
      
      <div className="text-sm text-gray-400">
        <p>For testing:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>User role: user@example.com (any password with 6+ chars)</li>
          <li>Admin role: admin@example.com (any password with 6+ chars)</li>
        </ul>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-pulse-500 hover:bg-pulse-600 text-white h-11 text-base"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Log in"}
      </Button>
    </form>
  );
}
