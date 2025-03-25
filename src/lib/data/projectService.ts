import { Project, Priority, ProjectStatus } from './types';
import { prisma } from '../prisma';

// Helper function to map Prisma project to our Project type
const mapPrismaProjectToProjectType = (project: any): Project => {
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
    team: project.teamMembers?.map((member: any) => member.userId) || [],
    tags: project.tags ? JSON.parse(project.tags) : [],
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString()
  };
};

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    const projects = await prisma.project.findMany({
      include: {
        teamMembers: true,
        client: true
      }
    });
    
    return projects.map(mapPrismaProjectToProjectType);
  },
  
  getProjectById: async (id: number): Promise<Project | null> => {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        teamMembers: true,
        client: true
      }
    });
    
    if (!project) return null;
    
    return mapPrismaProjectToProjectType(project);
  },
  
  getProjectsByClient: async (clientId: string): Promise<Project[]> => {
    const projects = await prisma.project.findMany({
      where: { clientId },
      include: {
        teamMembers: true,
        client: true
      }
    });
    
    return projects.map(mapPrismaProjectToProjectType);
  },
  
  getProjectsByTeamMember: async (userId: string): Promise<Project[]> => {
    const projects = await prisma.project.findMany({
      where: {
        teamMembers: {
          some: {
            userId
          }
        }
      },
      include: {
        teamMembers: true,
        client: true
      }
    });
    
    return projects.map(mapPrismaProjectToProjectType);
  },
  
  createProject: async (
    projectData: any,
    creatorId: string,
    creatorName: string
  ): Promise<Project | null> => {
    // Create the project
    const newProject = await prisma.project.create({
      data: {
        name: projectData.name,
        description: projectData.description || '',
        status: projectData.status,
        priority: projectData.priority,
        progress: projectData.progress || 0,
        startDate: projectData.startDate ? new Date(projectData.startDate) : new Date(),
        deadline: projectData.deadline ? new Date(projectData.deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
        budget: projectData.budget || null,
        spent: projectData.spent || 0,
        clientId: projectData.clientId || null,
        tags: projectData.tags ? JSON.stringify(projectData.tags) : null
      }
    });
    
    // Add team members if provided
    if (projectData.team && projectData.team.length > 0) {
      const teamMembers = projectData.team.map((userId: string) => ({ 
        projectId: newProject.id, 
        userId 
      }));
      
      await prisma.projectTeamMember.createMany({
        data: teamMembers
      });
    }
    
    // Create activity log entry
    await prisma.activityLog.create({
      data: {
        userId: creatorId,
        action: `created by ${creatorName}`,
        entityType: 'project',
        entityId: String(newProject.id),
        entityName: newProject.name,
        details: `New project created with status ${newProject.status}`
      }
    });
    
    // Get the project with related data
    const createdProject = await prisma.project.findUnique({
      where: { id: newProject.id },
      include: {
        teamMembers: true,
        client: true
      }
    });
    
    if (!createdProject) return null;
    
    return mapPrismaProjectToProjectType(createdProject);
  },
  
  updateProject: async (
    id: number,
    projectData: any,
    userId: string,
    userName: string
  ): Promise<Project | null> => {
    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id }
    });
    
    if (!existingProject) {
      return null;
    }
    
    // Update the project
    const updatedProject = await prisma.project.update({
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
        tags: projectData.tags ? JSON.stringify(projectData.tags) : undefined
      },
      include: {
        teamMembers: true,
        client: true
      }
    });
    
    // Update team members if provided
    if (projectData.team) {
      // First remove all existing team members
      await prisma.projectTeamMember.deleteMany({
        where: { projectId: id }
      });
      
      // Then add the new team members
      if (projectData.team.length > 0) {
        const teamMembers = projectData.team.map((userId: string) => ({ 
          projectId: id, 
          userId 
        }));
        
        await prisma.projectTeamMember.createMany({
          data: teamMembers
        });
      }
    }
    
    // Create activity log entry
    await prisma.activityLog.create({
      data: {
        userId: userId,
        action: `updated by ${userName}`,
        entityType: 'project',
        entityId: String(id),
        entityName: updatedProject.name,
        details: `Project updated with status ${updatedProject.status}`
      }
    });
    
    // Get the updated project with the new team members
    const finalProject = await prisma.project.findUnique({
      where: { id },
      include: {
        teamMembers: true,
        client: true
      }
    });
    
    if (!finalProject) return null;
    
    return mapPrismaProjectToProjectType(finalProject);
  },
  
  deleteProject: async (
    id: number,
    userId: string,
    userName: string
  ): Promise<boolean> => {
    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id }
    });
    
    if (!existingProject) {
      return false;
    }
    
    // First delete all team members (handle foreign key constraints)
    await prisma.projectTeamMember.deleteMany({
      where: { projectId: id }
    });
    
    // Then delete all tasks associated with this project
    // First delete comments on those tasks
    const tasks = await prisma.task.findMany({
      where: { projectId: id },
      select: { id: true }
    });
    
    if (tasks.length > 0) {
      const taskIds = tasks.map(task => task.id);
      
      await prisma.comment.deleteMany({
        where: { taskId: { in: taskIds } }
      });
      
      // Then delete the tasks
      await prisma.task.deleteMany({
        where: { projectId: id }
      });
    }
    
    // Finally delete the project
    await prisma.project.delete({
      where: { id }
    });
    
    // Create activity log entry
    await prisma.activityLog.create({
      data: {
        userId: userId,
        action: `deleted by ${userName}`,
        entityType: 'project',
        entityId: String(id),
        entityName: existingProject.name,
        details: `Project deleted with all associated tasks`
      }
    });
    
    return true;
  }
};