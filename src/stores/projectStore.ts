
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  deadline: string;
  progress: number;
  team: any[];
}

interface ProjectStore {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  addProject: (projectData: Omit<Project, 'id' | 'team'>) => Promise<void>;
  updateProject: (id: string, projectData: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  updateProjectTeam: (projectId: string, userIds: string[]) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  loading: false,
  error: null,
  
  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const { data: authData } = await supabase.auth.getUser();
      
      if (!authData || !authData.user) {
        set({ loading: false });
        return;
      }
      
      // Fetch projects
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*');
      
      if (error) throw error;
      
      // Fetch team members for each project
      const projectsWithTeam = await Promise.all((projects || []).map(async (project) => {
        const { data: members, error: membersError } = await supabase
          .from('project_members')
          .select('user_id')
          .eq('project_id', project.id);
        
        if (membersError) {
          console.error('Error fetching project members:', membersError);
          return { ...project, team: [] };
        }
        
        // Fetch user details for each member
        const userIds = members.map(member => member.user_id);
        if (userIds.length === 0) {
          return { ...project, team: [] };
        }
        
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('*')
          .in('id', userIds);
        
        if (usersError) {
          console.error('Error fetching team members:', usersError);
          return { ...project, team: [] };
        }
        
        return { ...project, team: users || [] };
      }));
      
      set({ projects: projectsWithTeam, loading: false });
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      set({ 
        error: error.message || 'Failed to fetch projects', 
        loading: false 
      });
    }
  },
  
  addProject: async (projectData) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('projects')
        .insert(projectData);
      
      if (error) throw error;
      
      // Refresh projects list
      await get().fetchProjects();
    } catch (error: any) {
      console.error('Error adding project:', error);
      set({ 
        error: error.message || 'Failed to add project', 
        loading: false 
      });
    }
  },
  
  updateProject: async (id, projectData) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh projects list
      await get().fetchProjects();
    } catch (error: any) {
      console.error('Error updating project:', error);
      set({ 
        error: error.message || 'Failed to update project', 
        loading: false 
      });
    }
  },
  
  deleteProject: async (id) => {
    set({ loading: true, error: null });
    try {
      // First delete project members
      const { error: membersError } = await supabase
        .from('project_members')
        .delete()
        .eq('project_id', id);
      
      if (membersError) throw membersError;
      
      // Then delete the project
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      set(state => ({
        projects: state.projects.filter(project => project.id !== id),
        loading: false
      }));
    } catch (error: any) {
      console.error('Error deleting project:', error);
      set({ 
        error: error.message || 'Failed to delete project', 
        loading: false 
      });
    }
  },
  
  updateProjectTeam: async (projectId, userIds) => {
    set({ loading: true, error: null });
    try {
      // First delete all existing team members
      const { error: deleteError } = await supabase
        .from('project_members')
        .delete()
        .eq('project_id', projectId);
      
      if (deleteError) throw deleteError;
      
      // Then add new team members
      if (userIds.length > 0) {
        const projectMembers = userIds.map(userId => ({
          project_id: projectId,
          user_id: userId
        }));
        
        const { error: insertError } = await supabase
          .from('project_members')
          .insert(projectMembers);
        
        if (insertError) throw insertError;
      }
      
      // Refresh projects list
      await get().fetchProjects();
    } catch (error: any) {
      console.error('Error updating project team:', error);
      set({ 
        error: error.message || 'Failed to update project team', 
        loading: false 
      });
    }
  }
}));
