import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'team' | 'client';
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  token: string | null;
  isAdmin: boolean;
  isTeam: boolean;
  isClient: boolean;
  isAuthenticated: boolean;
  hasRole: (role: 'admin' | 'team' | 'client') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in from Supabase session
  useEffect(() => {
    setLoading(true);
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserData(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserData(session.user);
      } else {
        setUser(null);
        setToken(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user data including role from the database
  const fetchUserData = async (supabaseUser: SupabaseUser) => {
    try {
      // Get user data from the users table, which includes role
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        throw error;
      }

      if (data) {
        const userData: User = {
          id: data.id,
          email: data.email,
          role: data.role as 'admin' | 'team' | 'client',
          name: data.name
        };
        
        setUser(userData);
        setToken(session?.access_token || null);
      } else {
        // If no user profile exists yet, create a default one
        // This is for new signups or when testing with seed data
        const defaultUserData: User = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          role: 'client', // Default role
          name: supabaseUser.email?.split('@')[0] || 'Anonymous'
        };

        // Insert the default user profile
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: defaultUserData.id,
            email: defaultUserData.email,
            name: defaultUserData.name,
            role: defaultUserData.role
          });

        if (insertError) {
          console.error('Error creating default user profile:', insertError);
          throw insertError;
        }

        setUser(defaultUserData);
        setToken(session?.access_token || null);

        toast({
          title: "Welcome!",
          description: "Your account has been created successfully",
        });
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error);
      toast({
        title: "Error",
        description: "Failed to load user data. Please try logging in again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast({
          title: "Login successful",
          description: `Welcome to ProjectPulse!`,
        });
        
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const hasRole = (role: 'admin' | 'team' | 'client'): boolean => {
    if (!user) return false;
    if (role === 'client') return true; // All authenticated users can access client routes
    if (user.role === 'admin') return true; // Admin has access to everything
    return user.role === role;
  };

  const isAdmin = user?.role === 'admin';
  const isTeam = user?.role === 'team' || user?.role === 'admin'; // Admins can do everything teams can
  const isClient = !!user; // Any authenticated user is at least a client
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      token, 
      isAdmin,
      isTeam,
      isClient,
      isAuthenticated,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
