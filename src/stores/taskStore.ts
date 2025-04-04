
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'team' | 'client';
}

interface Comment {
  id: string;
  text: string;
  date: string;
  user: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: string;
  priority: string;
  dueDate: string;
  assignedTo: User[];
  comments?: Comment[];
}

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  fetchTaskById: (id: string) => Promise<Task | null>;
  addTask: (task: Omit<Task, 'id' | 'assignedTo' | 'comments'> & { assignedTo: { id: string }[] }) => Promise<Task | null>;
  updateTask: (id: string, taskData: Partial<Omit<Task, 'assignedTo' | 'comments'>>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: string, comment: string) => Promise<void>;
  updateTaskAssignees: (id: string, assignees: { id: string }[]) => Promise<void>;
  addComment: (taskId: string, text: string, userId: string, userName: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  
  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      // First get all tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*');
      
      if (tasksError) throw tasksError;
      
      // Get all task assignees
      const { data: assigneesData, error: assigneesError } = await supabase
        .from('task_assignees')
        .select(`
          task_id,
          user_id,
          users:user_id (id, name, email, role)
        `);
      
      if (assigneesError) throw assigneesError;
      
      // Get all task comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('task_comments')
        .select(`
          id,
          task_id,
          text,
          created_at,
          users:user_id (name)
        `)
        .order('created_at', { ascending: false });
      
      if (commentsError) throw commentsError;
      
      // Format tasks with assignees and comments
      const formattedTasks = tasksData.map((task: any) => {
        // Get assignees for this task
        const taskAssignees = assigneesData
          .filter((a: any) => a.task_id === task.id)
          .map((a: any) => a.users);
        
        // Get comments for this task
        const taskComments = commentsData
          .filter((c: any) => c.task_id === task.id)
          .map((c: any) => ({
            id: c.id,
            text: c.text,
            date: format(new Date(c.created_at), 'MMM d, yyyy'),
            user: c.users.name
          }));
        
        return {
          id: task.id,
          title: task.title,
          description: task.description,
          projectId: task.project_id,
          status: task.status,
          priority: task.priority,
          dueDate: task.due_date,
          assignedTo: taskAssignees,
          comments: taskComments
        } as Task;
      });
      
      set({ tasks: formattedTasks, loading: false });
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      set({ 
        error: error.message || 'Failed to fetch tasks', 
        loading: false 
      });
    }
  },
  
  fetchTaskById: async (id) => {
    try {
      // Get the task
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();
      
      if (taskError) throw taskError;
      
      // Get task assignees
      const { data: assigneesData, error: assigneesError } = await supabase
        .from('task_assignees')
        .select(`
          user_id,
          users:user_id (id, name, email, role)
        `)
        .eq('task_id', id);
      
      if (assigneesError) throw assigneesError;
      
      // Get task comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('task_comments')
        .select(`
          id,
          text,
          created_at,
          users:user_id (name)
        `)
        .eq('task_id', id)
        .order('created_at', { ascending: false });
      
      if (commentsError) throw commentsError;
      
      // Format task with assignees and comments
      const formattedTask = {
        id: task.id,
        title: task.title,
        description: task.description,
        projectId: task.project_id,
        status: task.status,
        priority: task.priority,
        dueDate: task.due_date,
        assignedTo: assigneesData.map((a: any) => a.users),
        comments: commentsData.map((c: any) => ({
          id: c.id,
          text: c.text,
          date: format(new Date(c.created_at), 'MMM d, yyyy'),
          user: c.users.name
        }))
      } as Task;
      
      return formattedTask;
    } catch (error: any) {
      console.error('Error fetching task by ID:', error);
      return null;
    }
  },
  
  addTask: async (task) => {
    set({ loading: true, error: null });
    try {
      // Insert task
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .insert({
          title: task.title,
          description: task.description,
          project_id: task.projectId,
          status: task.status,
          priority: task.priority,
          due_date: task.dueDate
        })
        .select()
        .single();
      
      if (taskError) throw taskError;
      
      // Add assignees if any
      if (task.assignedTo && task.assignedTo.length > 0) {
        const assigneesData = task.assignedTo.map(assignee => ({
          task_id: taskData.id,
          user_id: assignee.id
        }));
        
        const { error: assigneesError } = await supabase
          .from('task_assignees')
          .insert(assigneesData);
          
        if (assigneesError) throw assigneesError;
      }
      
      // Fetch the complete task with assignees
      const newTask = await get().fetchTaskById(taskData.id);
      
      // Update state with new task
      if (newTask) {
        set(state => ({ 
          tasks: [...state.tasks, newTask],
          loading: false 
        }));
      }
      
      return newTask;
    } catch (error: any) {
      console.error('Error adding task:', error);
      set({ 
        error: error.message || 'Failed to add task', 
        loading: false 
      });
      return null;
    }
  },
  
  updateTask: async (id, taskData) => {
    set({ loading: true, error: null });
    try {
      // Format the data to match the database schema
      const dbTaskData = {
        ...taskData,
        project_id: taskData.projectId,
      };
      delete (dbTaskData as any).projectId;
      
      const { error } = await supabase
        .from('tasks')
        .update(dbTaskData)
        .eq('id', id);
      
      if (error) throw error;
      
      // Fetch the updated task to ensure we have the latest data
      const updatedTask = await get().fetchTaskById(id);
      
      // Update state with updated task
      if (updatedTask) {
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === id ? updatedTask : task
          ),
          loading: false
        }));
      }
    } catch (error: any) {
      console.error('Error updating task:', error);
      set({ 
        error: error.message || 'Failed to update task', 
        loading: false 
      });
    }
  },
  
  deleteTask: async (id) => {
    set({ loading: true, error: null });
    try {
      // Delete task assignees first (cascading would be better but handling it manually for safety)
      const { error: assigneesError } = await supabase
        .from('task_assignees')
        .delete()
        .eq('task_id', id);
      
      if (assigneesError) throw assigneesError;
      
      // Delete task comments
      const { error: commentsError } = await supabase
        .from('task_comments')
        .delete()
        .eq('task_id', id);
      
      if (commentsError) throw commentsError;
      
      // Delete the task
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update state by removing the deleted task
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id),
        loading: false
      }));
    } catch (error: any) {
      console.error('Error deleting task:', error);
      set({ 
        error: error.message || 'Failed to delete task', 
        loading: false 
      });
    }
  },
  
  updateTaskStatus: async (id, status, comment) => {
    set({ loading: true, error: null });
    try {
      // Start a transaction by using multiple operations
      
      // 1. Update task status
      const { error: statusError } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', id);
      
      if (statusError) throw statusError;
      
      // 2. Add a comment about the status change
      const { data: userData } = await supabase.auth.getUser();
      
      if (userData.user) {
        const { data: userInfo, error: userError } = await supabase
          .from('users')
          .select('name')
          .eq('id', userData.user.id)
          .single();
        
        if (userError) throw userError;
        
        const { error: commentError } = await supabase
          .from('task_comments')
          .insert({
            task_id: id,
            user_id: userData.user.id,
            text: `Status changed to "${status}": ${comment}`
          });
        
        if (commentError) throw commentError;
      }
      
      // Fetch the updated task
      const updatedTask = await get().fetchTaskById(id);
      
      // Update state with updated task
      if (updatedTask) {
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === id ? updatedTask : task
          ),
          loading: false
        }));
      }
    } catch (error: any) {
      console.error('Error updating task status:', error);
      set({ 
        error: error.message || 'Failed to update task status', 
        loading: false 
      });
    }
  },
  
  updateTaskAssignees: async (id, assignees) => {
    set({ loading: true, error: null });
    try {
      // First delete all existing assignees
      const { error: deleteError } = await supabase
        .from('task_assignees')
        .delete()
        .eq('task_id', id);
      
      if (deleteError) throw deleteError;
      
      // Then add the new assignees if any
      if (assignees.length > 0) {
        const assigneesData = assignees.map(assignee => ({
          task_id: id,
          user_id: assignee.id
        }));
        
        const { error: insertError } = await supabase
          .from('task_assignees')
          .insert(assigneesData);
        
        if (insertError) throw insertError;
      }
      
      // Fetch the updated task
      const updatedTask = await get().fetchTaskById(id);
      
      // Update state with updated task
      if (updatedTask) {
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === id ? updatedTask : task
          ),
          loading: false
        }));
      }
    } catch (error: any) {
      console.error('Error updating task assignees:', error);
      set({ 
        error: error.message || 'Failed to update task assignees', 
        loading: false 
      });
    }
  },
  
  addComment: async (taskId, text, userId, userName) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('task_comments')
        .insert({
          task_id: taskId,
          user_id: userId,
          text
        });
      
      if (error) throw error;
      
      // Fetch the updated task
      const updatedTask = await get().fetchTaskById(taskId);
      
      // Update state with updated task
      if (updatedTask) {
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === taskId ? updatedTask : task
          ),
          loading: false
        }));
      }
    } catch (error: any) {
      console.error('Error adding comment:', error);
      set({ 
        error: error.message || 'Failed to add comment', 
        loading: false 
      });
    }
  }
}));
