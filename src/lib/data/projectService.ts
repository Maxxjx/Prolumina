import { Project, Priority, ProjectStatus } from './types';
import { prisma } from '../prisma';

// Helper function to map Prisma project to our Project type
const mapPrismaProjectToProjectType = (project: any): Project => {
  let tags: string[] = [];
  
  if (project.tags) {
    // First try parsing as JSON if it looks like a JSON array
    if (project.tags.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(project.tags);
        if (Array.isArray(parsed)) {
          tags = parsed;
        } else {
          // If parsed but not an array, treat as comma-separated
          tags = project.tags.split(',').map(tag => tag.trim());
        }
      } catch (error) {
        // If JSON parsing fails, treat as comma-separated
        tags = project.tags.split(',').map(tag => tag.trim());
        console.error('Tag parsing failed, treating as comma-separated:', error);
      }
    } else {
      // If doesn't look like JSON array, treat as comma-separated
      tags = project.tags.split(',').map(tag => tag.trim());
    }
    // Filter out any empty tags
    tags = tags.filter(tag => tag.length > 0);
  }

  return {
    id: project.id,
    name: project.name,
    description: project.description || '',
    status: project.status as ProjectStatus,
    priority: project.priority as Priority,
    progress: project.progress,
    startDate: project.startDate.toISOString(),
    deadline: project.deadline.toISOString(),
    budget: project.budget || undefined,
    spent: project.spent || undefined,
    clientId: project.clientId || undefined,
    team: project.team?.map((member: any) => member.id) || [],
    tags: tags,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString()
  };
};

// Helper function to normalize tags input
const normalizeProjectTags = (tags: any): string | null => {
  if (!tags) return null;
  
  // If it's already a string, parse it if JSON or split if comma-separated
  if (typeof tags === 'string') {
    try {
      // Check if it's already valid JSON
      JSON.parse(tags);
      return tags;
    } catch {
      // If not JSON, split by comma and convert to JSON
      return JSON.stringify(tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0));
    }
  }
  
  // If it's an array, stringify it
  if (Array.isArray(tags)) {
    return JSON.stringify(tags.filter(tag => tag && tag.length > 0));
  }
  
  // If it's anything else, convert to string and treat as single tag
  return JSON.stringify([String(tags)]);
};

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    const projects = await prisma.project.findMany({
      include: {
        team: true,
        client: true
      }
    });
    
    return projects.map(mapPrismaProjectToProjectType);
  },
  
  getProjectById: async (id: number): Promise<Project | null> => {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        team: true,
        client: true
      }
    });
    
    if (!project) return null;
    
    return mapPrismaProjectToProjectType(project);
  },

  createProject: async (projectData: any): Promise<Project> => {
    const project = await prisma.project.create({
      data: {
        name: projectData.name,
        description: projectData.description,
        status: projectData.status || 'NOT_STARTED',
        priority: projectData.priority || 'MEDIUM',
        progress: projectData.progress || 0,
        startDate: projectData.startDate ? new Date(projectData.startDate) : new Date(),
        deadline: projectData.deadline ? new Date(projectData.deadline) : new Date(),
        budget: projectData.budget || 0,
        spent: projectData.spent || 0,
        clientId: projectData.clientId,
        tags: normalizeProjectTags(projectData.tags),
        team: {
          connect: projectData.team?.map((id: string) => ({ id })) || []
        }
      },
      include: {
        team: true,
        client: true
      }
    });

    return mapPrismaProjectToProjectType(project);
  },

  updateProject: async (id: number, projectData: any): Promise<Project | null> => {
    const project = await prisma.project.update({
      where: { id },
      data: {
        name: projectData.name,
        description: projectData.description,
        status: projectData.status,
        priority: projectData.priority,
        progress: projectData.progress,
        startDate: projectData.startDate ? new Date(projectData.startDate) : undefined,
        deadline: projectData.deadline ? new Date(projectData.deadline) : undefined,
        budget: projectData.budget,
        spent: projectData.spent,
        clientId: projectData.clientId,
        tags: normalizeProjectTags(projectData.tags),
        team: {
          set: projectData.team?.map((id: string) => ({ id })) || []
        }
      },
      include: {
        team: true,
        client: true
      }
    });

    return mapPrismaProjectToProjectType(project);
  },

  deleteProject: async (id: number): Promise<boolean> => {
    try {
      await prisma.project.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  },
  
  getProjectsByClient: async (clientId: string): Promise<Project[]> => {
    const projects = await prisma.project.findMany({
      where: { clientId },
      include: {
        team: true,
        client: true
      }
    });
    
    return projects.map(mapPrismaProjectToProjectType);
  },
  
  getProjectsByTeamMember: async (userId: string): Promise<Project[]> => {
    const projects = await prisma.project.findMany({
      where: {
        team: {
          some: {
            id: userId
          }
        }
      },
      include: {
        team: true,
        client: true
      }
    });
    
    return projects.map(mapPrismaProjectToProjectType);
  }
};