import { Task, Comment, TaskStatus, Priority } from './types';
import { prisma } from '../prisma';

// Helper function to map Prisma tasks to our Task type
const mapPrismaTaskToTaskType = (task: any): Task => {
  let tags: string[] = [];
  try {
    if (task.tags) {
      // Handle both JSON string and comma-separated string formats
      try {
        tags = JSON.parse(task.tags);
      } catch {
        // If JSON parsing fails, treat it as a comma-separated string
        tags = task.tags.split(',').map((tag: string) => tag.trim());
      }
    }
  } catch (error) {
    console.error('Error parsing tags:', error);
    tags = [];
  }

  return {
    id: task.id,
    title: task.title,
    description: task.description || '',
    status: task.status as TaskStatus,
    priority: task.priority as Priority,
    projectId: task.projectId,
    project: task.project ? task.project.name : '',
    assigneeId: task.assigneeId || undefined,
    assignee: task.assignee ? task.assignee.name : '',
    deadline: task.deadline?.toISOString() || '',
    estimatedHours: task.estimatedHours || undefined,
    actualHours: task.actualHours || undefined,
    createdBy: task.creatorId || '',
    created: task.createdAt.toISOString(),
    updated: task.updatedAt.toISOString(),
    tags,
    comments: task.comments ? task.comments.map((comment: any) => ({
      id: comment.id,
      taskId: task.id,
      userId: comment.userId,
      userName: comment.user ? comment.user.name : '',
      text: comment.text,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString()
    })) : []
  };
};

export const taskService = {
  getTasks: async (): Promise<Task[]> => {
    const tasks = await prisma.task.findMany({
      include: {
        assignee: true,
        project: true,
        comments: {
          include: {
            user: true
          }
        }
      }
    });
    
    return tasks.map(mapPrismaTaskToTaskType);
  },
  
  getTaskById: async (id: number): Promise<Task | null> => {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignee: true,
        project: true,
        comments: {
          include: {
            user: true
          }
        }
      }
    });
    
    if (!task) return null;
    
    return mapPrismaTaskToTaskType(task);
  },
  
  getTasksByProject: async (projectId: number): Promise<Task[]> => {
    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: true,
        project: true,
        comments: {
          include: {
            user: true
          }
        }
      }
    });
    
    return tasks.map(mapPrismaTaskToTaskType);
  },
  
  getTasksByAssignee: async (assigneeId: string): Promise<Task[]> => {
    const tasks = await prisma.task.findMany({
      where: { assigneeId },
      include: {
        project: true,
        assignee: true,
        comments: {
          include: {
            user: true
          }
        }
      }
    });
    
    return tasks.map(mapPrismaTaskToTaskType);
  },
  
  getTasksByStatus: async (status: string): Promise<Task[]> => {
    const tasks = await prisma.task.findMany({
      where: { status },
      include: {
        assignee: true,
        project: true,
        comments: {
          include: {
            user: true
          }
        }
      }
    });
    
    return tasks.map(mapPrismaTaskToTaskType);
  },
  
  createTask: async (
    taskData: any,
    creatorId: string,
    creatorName: string
  ): Promise<Task | null> => {
    const newTask = await prisma.task.create({
      data: {
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status,
        priority: taskData.priority,
        deadline: taskData.deadline ? new Date(taskData.deadline) : new Date(),
        projectId: taskData.projectId,
        assigneeId: taskData.assigneeId,
        creatorId: creatorId
      },
      include: {
        assignee: true,
        project: true
      }
    });
    
    // Create activity log entry in database
    await prisma.activityLog.create({
      data: {
        userId: creatorId,
        action: `created by ${creatorName}`,
        entityType: 'task',
        entityId: String(newTask.id),
        entityName: newTask.title,
        details: `Task created for project ${taskData.projectId}`
      }
    });
    
    // Get project name through a separate query if needed
    let projectName = '';
    if (newTask.projectId) {
      const project = await prisma.project.findUnique({
        where: { id: newTask.projectId },
        select: { name: true }
      });
      if (project) {
        projectName = project.name;
      }
    }
    
    // Get assignee name through a separate query if needed
    let assigneeName = '';
    if (newTask.assigneeId) {
      const assignee = await prisma.user.findUnique({
        where: { id: newTask.assigneeId },
        select: { name: true }
      });
      if (assignee) {
        assigneeName = assignee.name;
      }
    }
    
    return {
      id: newTask.id,
      title: newTask.title,
      description: newTask.description || '',
      status: newTask.status as TaskStatus,
      priority: newTask.priority as Priority,
      deadline: newTask.deadline?.toISOString() || '',
      created: newTask.createdAt.toISOString(),
      updated: newTask.updatedAt.toISOString(),
      projectId: newTask.projectId,
      project: projectName,
      assigneeId: newTask.assigneeId || undefined,
      assignee: assigneeName,
      createdBy: creatorId,
      comments: []
    };
  },
  
  updateTask: async (
    id: number,
    taskData: any,
    userId: string,
    userName: string
  ): Promise<Task | null> => {
    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id },
      include: { project: true }
    });
    
    if (!existingTask) {
      return null;
    }
    
    // Update the task
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        deadline: taskData.deadline ? new Date(taskData.deadline) : undefined,
        assigneeId: taskData.assigneeId,
        // Add any other fields that can be updated
      },
      include: {
        assignee: true,
        project: true,
        comments: {
          include: {
            user: true
          }
        }
      }
    });
    
    // Create activity log entry
    await prisma.activityLog.create({
      data: {
        userId: userId,
        action: `updated by ${userName}`,
        entityType: 'task',
        entityId: String(id),
        entityName: updatedTask.title,
        details: `Task updated in project ${updatedTask.projectId}`
      }
    });
    
    return mapPrismaTaskToTaskType(updatedTask);
  },
  
  deleteTask: async (
    id: number,
    userId: string,
    userName: string
  ): Promise<boolean> => {
    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id }
    });
    
    if (!existingTask) {
      return false;
    }
    
    // Delete comments first (handle foreign key constraints)
    await prisma.comment.deleteMany({
      where: { taskId: id }
    });
    
    // Delete the task
    await prisma.task.delete({
      where: { id }
    });
    
    // Create activity log entry
    await prisma.activityLog.create({
      data: {
        userId: userId,
        action: `deleted by ${userName}`,
        entityType: 'task',
        entityId: String(id),
        entityName: existingTask.title,
        details: `Task deleted from project ${existingTask.projectId}`
      }
    });
    
    return true;
  },
  
  createComment: async (
    taskId: number,
    text: string,
    userId: string,
    userName: string
  ): Promise<Comment | null> => {
    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });
    
    if (!task) {
      return null;
    }
    
    // Create comment
    const comment = await prisma.comment.create({
      data: {
        text,
        userId,
        taskId
      },
      include: {
        user: true
      }
    });
    
    // Create activity log entry
    await prisma.activityLog.create({
      data: {
        userId,
        action: `commented by ${userName}`,
        entityType: 'task',
        entityId: String(taskId),
        entityName: task.title,
        details: `New comment: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`
      }
    });
    
    return {
      id: comment.id,
      taskId,
      userId,
      userName: comment.user?.name || userName,
      text: comment.text,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString()
    };
  }
};
