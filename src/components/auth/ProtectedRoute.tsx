
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'team' | 'client';
  redirectPath?: string;
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole = 'client',
  redirectPath = '/login',
  children,
}) => {
  const { isAuthenticated, hasRole, loading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  // Show loading state
  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-dark-300">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pulse-500"></div>
    </div>;
  }

  // Check if user is authenticated and has the required role
  const hasAccess = isAuthenticated && hasRole(requiredRole);

  if (!hasAccess) {
    // Show toast message if user doesn't have access
    if (isAuthenticated) {
      toast({
        title: "Access denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
    }

    // Redirect to login with the return URL
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If there are children, render them, otherwise render the Outlet
  return <>{children ? children : <Outlet />}</>;
};

export default ProtectedRoute;
