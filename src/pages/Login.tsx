
import React, { useState, useEffect } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ChevronLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import ResponsiveLoginForm from '@/components/auth/ResponsiveLoginForm';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, login, loading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    // Check for auth-related query parameters
    const params = new URLSearchParams(location.search);
    const errorCode = params.get('error');
    const errorDescription = params.get('error_description');
    
    if (errorCode) {
      toast({
        title: "Authentication Error",
        description: errorDescription || "There was a problem with your login",
        variant: "destructive",
      });
    }
  }, [location.search, toast]);

  if (user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-300 overflow-hidden relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-pulse-900 via-pulse-800 to-dark-300 opacity-90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pulse-600/40 via-pulse-800/30 to-transparent"></div>
        <div className="absolute w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiM4YjVjZjYxMCIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIj48L3JlY3Q+PC9zdmc+')]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-dark-300 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 w-full h-full">
          <div className="absolute top-[10%] left-[20%] w-64 h-64 bg-pulse-500/20 rounded-full filter blur-3xl"></div>
          <div className="absolute top-[20%] right-[20%] w-72 h-72 bg-pulse-600/20 rounded-full filter blur-3xl"></div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-6 flex justify-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-md bg-pulse-500 bg-gradient-to-br from-pulse-400 to-pulse-600 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="font-bold text-2xl text-white">Prolumina</span>
            </Link>
          </div>
          
          <Card className="border-white/5 bg-dark-200/60 backdrop-blur-lg shadow-xl">
            <CardHeader className="space-y-1 px-4 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl font-bold text-center text-white">Log in</CardTitle>
              <CardDescription className="text-center text-gray-300 text-sm sm:text-base">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              {location.state?.from && (
                <Alert className="mb-4 bg-dark-300/80 border-pulse-500/50">
                  <AlertCircle className="h-4 w-4 text-pulse-500" />
                  <AlertDescription className="text-sm text-gray-300">
                    You need to log in to access that page
                  </AlertDescription>
                </Alert>
              )}
              
              <ResponsiveLoginForm 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                loading={loading}
                onSubmit={handleSubmit}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 px-4 sm:px-6">
              <div className="text-sm text-center text-gray-400">
                Don't have an account?{" "}
                <Link to="#" className="text-pulse-300 hover:text-pulse-200 font-medium">
                  Sign up
                </Link>
              </div>
              <Link to="/" className="w-full flex items-center justify-center text-sm text-gray-400 hover:text-white">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to home
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
