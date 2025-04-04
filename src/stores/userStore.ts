import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

// Helper function to generate a UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, 
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'team' | 'client';
  avatar_url?: string | null;
}

interface UserStore {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<User | null>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  loading: false,
  error: null,
  
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const { data: authData } = await supabase.auth.getUser();
      
      if (!authData || !authData.user) {
        set({ loading: false });
        return;
      }
      
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) throw error;
      
      set({ users: data as User[], loading: false });
      console.log('Fetched users:', data);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      set({ 
        error: error.message || 'Failed to fetch users', 
        loading: false 
      });
    }
  },
  
  addUser: async (user) => {
    set({ loading: true, error: null });
    try {
      // Generate a UUID for the new user
      const userId = generateUUID();
      
      // Insert user data directly (note: in a real production app, you would use proper auth)
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar_url: user.avatar_url || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update state with new user
      set(state => ({ 
        users: [...state.users, data as User],
        loading: false 
      }));
      
      // Return the newly created user
      return data as User;
    } catch (error: any) {
      console.error('Error adding user:', error);
      set({ 
        error: error.message || 'Failed to add user', 
        loading: false 
      });
      return null;
    }
  },
  
  updateUser: async (id, userData) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', id);
      
      if (error) throw error;
      
      // Update state with updated user
      set(state => ({
        users: state.users.map(user => 
          user.id === id 
            ? { ...user, ...userData } 
            : user
        ),
        loading: false
      }));
    } catch (error: any) {
      console.error('Error updating user:', error);
      set({ 
        error: error.message || 'Failed to update user', 
        loading: false 
      });
    }
  },
  
  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      // Delete user data directly (note: in a real production app with auth, you would handle auth deletion as well)
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update state by removing the deleted user
      set(state => ({
        users: state.users.filter(user => user.id !== id),
        loading: false
      }));
    } catch (error: any) {
      console.error('Error deleting user:', error);
      set({ 
        error: error.message || 'Failed to delete user', 
        loading: false 
      });
    }
  }
}));
