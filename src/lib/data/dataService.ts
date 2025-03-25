import { prisma, testDatabaseConnection } from '../prisma';
import { 
  User, 
  Project, 
  Task, 
  Comment, 
  TimeEntry,
  Notification,
  ActivityLog
} from './types';

/**
 * Initializes the data service
 * - Tests the database connection
 * - Establishes database as the only data source
 * 
 * @returns Promise<boolean> - Whether database connection was successful
 */
export async function initializeDataService(): Promise<boolean> {
  try {
    // Test the database connection
    const isDbConnected = await testDatabaseConnection();
    
    if (!isDbConnected) {
      console.error('Database connection failed - application may not function correctly');
      return false;
    }
    
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Error initializing data service:', error);
    return false;
  }
}

// Data services that use database
export const userService = {
  getUsers: async (): Promise<User[]> => {
    try {
      const users = await prisma.user.findMany();
      return users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as any,
        avatar: user.avatar || undefined,
        position: user.position || undefined,
        department: user.department || undefined,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      }));
    } catch (error) {
      console.error('Error fetching users from database:', error);
      throw error;
    }
  },
  
  getUserById: async (userId: string): Promise<User | null> => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (!user) return null;
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as any,
        avatar: user.avatar || undefined,
        position: user.position || undefined,
        department: user.department || undefined,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Error fetching user from database:', error);
      throw error;
    }
  },
  
  getUserByEmail: async (email: string): Promise<User | null> => {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });
      
      if (!user) return null;
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as any,
        avatar: user.avatar || undefined,
        position: user.position || undefined,
        department: user.department || undefined,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Error fetching user from database:', error);
      throw error;
    }
  },
  
  createUser: async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
    try {
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role,
          avatar: userData.avatar,
          position: userData.position,
          department: userData.department
        }
      });
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as any,
        avatar: user.avatar || undefined,
        position: user.position || undefined,
        department: user.department || undefined,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Error creating user in database:', error);
      throw error;
    }
  },
  
  updateUser: async (id: string, userData: Partial<User>): Promise<User | null> => {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role,
          avatar: userData.avatar,
          position: userData.position,
          department: userData.department
        }
      });
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as any,
        avatar: user.avatar || undefined,
        position: user.position || undefined,
        department: user.department || undefined,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      };
    } catch (error) {
      console.error(`Error updating user with ID ${id} in database:`, error);
      throw error;
    }
  },
  
  deleteUser: async (id: string): Promise<boolean> => {
    try {
      await prisma.user.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error(`Error deleting user with ID ${id} from database:`, error);
      throw error;
    }
  }
};

// Project service
export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    try {
      const projects = await prisma.project.findMany({
        include: {
          client: true
        }
      });
      
      return projects.map(project => ({
        deadline: project.deadline?.toISOString() || "",
        team: [],
        priority: "low",
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        id: project.id,
        name: project.name,
        description: project.description,
        startDate: project.startDate.toISOString(),
        endDate: project.endDate ? project.endDate.toISOString() : null,
        status: project.status,
        progress: project.progress,
        budget: project.budget,
        client: project.client ? {
          id: project.client.id,
          name: project.client.name
        } : undefined
      }));
    } catch (error) {
      console.error('Error fetching projects from database:', error);
      throw error;
    }
  },
  
  getProjectById: async (projectId: string): Promise<Project | null> => {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          client: true
        }
      });
      
      if (!project) return null;
      
      return {
        id: project.id,
        name: project.name,
        description: project.description,
        startDate: project.startDate.toISOString(),
        endDate: project.endDate ? project.endDate.toISOString() : null,
        status: project.status,
        progress: project.progress,
        budget: project.budget,
        client: project.client ? {
          id: project.client.id,
          name: project.client.name
        } : undefined
      };
    } catch (error) {
      console.error('Error fetching project from database:', error);
      throw error;
    }
  }
};

// Task service
export const taskService = {
  getTasks: async (): Promise<Task[]> => {
    try {
      const tasks = await prisma.task.findMany({
        include: {
          project: true,
          assignee: true,
          creator: true
        }
      });
      
      return tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        projectId: task.projectId,
        project: task.project.name,
        assigneeId: task.assigneeId || undefined,
        assignee: task.assignee ? task.assignee.name : '',
        deadline: task.deadline.toISOString(),
        estimatedHours: task.estimatedHours || undefined,
        actualHours: task.actualHours || undefined,
        createdBy: task.creator.name,
        created: task.createdAt.toISOString(),
        updated: task.updatedAt.toISOString(),
        tags: task.tags ? task.tags.split(',') : [],
        attachments: [],  // We'd need to fetch these separately
        comments: []      // We'd need to fetch these separately
      }));
    } catch (error) {
      console.error('Error fetching tasks from database:', error);
      throw error;
    }
  },
  
  getTasksByProjectId: async (projectId: string): Promise<Task[]> => {
    try {
      const tasks = await prisma.task.findMany({
        where: { projectId },
        include: {
          project: true,
          assignee: true,
          creator: true
        }
      });
      
      return tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        projectId: task.projectId,
        project: task.project.name,
        assigneeId: task.assigneeId || undefined,
        assignee: task.assignee ? task.assignee.name : '',
        deadline: task.deadline.toISOString(),
        estimatedHours: task.estimatedHours || undefined,
        actualHours: task.actualHours || undefined,
        createdBy: task.creator.name,
        created: task.createdAt.toISOString(),
        updated: task.updatedAt.toISOString(),
        tags: task.tags ? task.tags.split(',') : [],
        attachments: [],
        comments: []
      }));
    } catch (error) {
      console.error('Error fetching tasks by project from database:', error);
      throw error;
    }
  },
  
  getTaskById: async (taskId: string): Promise<Task | null> => {
    try {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
          project: true,
          assignee: true,
          creator: true
        }
      });
      
      if (!task) return null;
      
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        projectId: task.projectId,
        project: task.project.name,
        assigneeId: task.assigneeId || undefined,
        assignee: task.assignee ? task.assignee.name : '',
        deadline: task.deadline.toISOString(),
        estimatedHours: task.estimatedHours || undefined,
        actualHours: task.actualHours || undefined,
        createdBy: task.creator.name,
        created: task.createdAt.toISOString(),
        updated: task.updatedAt.toISOString(),
        tags: task.tags ? task.tags.split(',') : [],
        attachments: [],
        comments: []
      };
    } catch (error) {
      console.error('Error fetching task from database:', error);
      throw error;
    }
  }
};

// Time Entry service
export const timeEntryService = {
  getTimeEntries: async (): Promise<TimeEntry[]> => {
    try {
      const timeEntries = await prisma.timeEntry.findMany({
        include: {
          task: {
            include: {
              project: true
            }
          },
          user: true
        }
      });
      
      return timeEntries.map(entry => ({
        id: entry.id,
        description: entry.description,
        startTime: entry.startTime.toISOString(),
        endTime: entry.endTime ? entry.endTime.toISOString() : null,
        duration: entry.duration,
        taskId: entry.taskId,
        task: {
          title: entry.task.title,
          projectId: entry.task.projectId,
          project: entry.task.project.name
        },
        userId: entry.userId,
        user: {
          name: entry.user.name,
          position: entry.user.position || undefined
        }
      }));
    } catch (error) {
      console.error('Error fetching time entries from database:', error);
      throw error;
    }
  },
  
  getTimeEntriesByUserId: async (userId: string): Promise<TimeEntry[]> => {
    try {
      const timeEntries = await prisma.timeEntry.findMany({
        where: { userId },
        include: {
          task: {
            include: {
              project: true
            }
          },
          user: true
        }
      });
      
      return timeEntries.map(entry => ({
        id: entry.id,
        description: entry.description,
        startTime: entry.startTime.toISOString(),
        endTime: entry.endTime ? entry.endTime.toISOString() : null,
        duration: entry.duration,
        taskId: entry.taskId,
        task: {
          title: entry.task.title,
          projectId: entry.task.projectId,
          project: entry.task.project.name
        },
        userId: entry.userId,
        user: {
          name: entry.user.name,
          position: entry.user.position || undefined
        }
      }));
    } catch (error) {
      console.error('Error fetching time entries by user from database:', error);
      throw error;
    }
  },
  
  getTimeEntriesByTaskId: async (taskId: string): Promise<TimeEntry[]> => {
    try {
      const timeEntries = await prisma.timeEntry.findMany({
        where: { taskId },
        include: {
          task: {
            include: {
              project: true
            }
          },
          user: true
        }
      });
      
      return timeEntries.map(entry => ({
        id: entry.id,
        description: entry.description,
        startTime: entry.startTime.toISOString(),
        endTime: entry.endTime ? entry.endTime.toISOString() : null,
        duration: entry.duration,
        taskId: entry.taskId,
        task: {
          title: entry.task.title,
          projectId: entry.task.projectId,
          project: entry.task.project.name
        },
        userId: entry.userId,
        user: {
          name: entry.user.name,
          position: entry.user.position || undefined
        }
      }));
    } catch (error) {
      console.error('Error fetching time entries by task from database:', error);
      throw error;
    }
  }
};