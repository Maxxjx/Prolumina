import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Prisma } from '@prisma/client';
import { errorResponse, handleDatabaseError, handleAuthError } from '@/lib/api-utils';
import { ProjectStats, TaskStats, UserStats, TimeStats, StatusCount, ProjectStatus, Priority } from '@/lib/data/types';

// Helper function to map string status to ProjectStatus enum
const mapProjectStatus = (status: string): ProjectStatus => {
  switch (status) {
    case 'Not Started':
      return ProjectStatus.NOT_STARTED;
    case 'In Progress':
      return ProjectStatus.IN_PROGRESS;
    case 'On Hold':
      return ProjectStatus.ON_HOLD;
    case 'Completed':
      return ProjectStatus.COMPLETED;
    case 'Cancelled':
      return ProjectStatus.CANCELLED;
    case 'Almost Complete':
      return ProjectStatus.ALMOST_COMPLETE;
    default:
      return ProjectStatus.NOT_STARTED;
  }
};

// Helper function to map string priority to Priority enum
const mapPriority = (priority: string): Priority => {
  switch (priority) {
    case 'Low':
      return Priority.LOW;
    case 'Medium':
      return Priority.MEDIUM;
    case 'High':
      return Priority.HIGH;
    case 'Urgent':
      return Priority.URGENT;
    default:
      return Priority.LOW;
  }
};

// Analytics service with database implementation
const analyticsService = {
  getProjectStats: async (): Promise<ProjectStats> => {
    try {
      // Get total count of projects
      const totalProjects = await prisma.project.count();
      
      // Get projects by status using Prisma
      const projectsByStatus = await prisma.project.groupBy({
        by: ['status'],
        _count: true
      });
      
      // Get projects by priority using Prisma
      const projectsByPriority = await prisma.project.groupBy({
        by: ['priority'],
        _count: true
      });
      
      // Get recent projects
      const recentProjects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          status: true,
          priority: true,
          progress: true,
          createdAt: true
        }
      });
      
      return {
        totalProjects: Number(totalProjects),
        projectsByStatus: projectsByStatus.map(stat => ({
          status: stat.status,
          count: Number(stat._count)
        })),
        projectsByPriority: projectsByPriority.map(stat => ({
          status: stat.priority,
          count: Number(stat._count)
        })),
        recentProjects: recentProjects.map(p => ({
          ...p,
          id: p.id.toString(),
          status: mapProjectStatus(p.status),
          priority: mapPriority(p.priority),
          createdAt: p.createdAt.toISOString()
        }))
      };
    } catch (error) {
      console.error('Error fetching project stats:', error);
      throw error;
    }
  },
  
  getTaskStats: async (): Promise<TaskStats> => {
    try {
      // Get total count of tasks
      const totalTasks = await prisma.task.count();
      
      // Get tasks by status using Prisma
      const tasksByStatus = await prisma.task.groupBy({
        by: ['status'],
        _count: true
      });
      
      // Get tasks by priority using Prisma
      const tasksByPriority = await prisma.task.groupBy({
        by: ['priority'],
        _count: true
      });
      
      // Get overdue tasks
      const today = new Date();
      const overdueTasks = await prisma.task.count({
        where: {
          deadline: { lt: today },
          status: { not: 'Completed' }
        }
      });
      
      // Get upcoming tasks due in 7 days
      const next7Days = new Date(today);
      next7Days.setDate(today.getDate() + 7);
      
      const upcomingTasks = await prisma.task.count({
        where: {
          deadline: {
            gte: today,
            lte: next7Days
          },
          status: { not: 'Completed' }
        }
      });
      
      return {
        totalTasks: Number(totalTasks),
        tasksByStatus: tasksByStatus.map(stat => ({
          status: stat.status,
          count: Number(stat._count)
        })),
        tasksByPriority: tasksByPriority.map(stat => ({
          status: stat.priority,
          count: Number(stat._count)
        })),
        overdueTasks: Number(overdueTasks),
        upcomingTasks: Number(upcomingTasks)
      };
    } catch (error) {
      console.error('Error fetching task stats:', error);
      throw error;
    }
  },
  
  getUserStats: async (): Promise<UserStats> => {
    try {
      // Get total count of users
      const totalUsers = await prisma.user.count();
      
      // Get tasks by assignee using Prisma
      const tasksByAssignee = await prisma.user.findMany({
        select: {
          name: true,
          _count: {
            select: {
              tasks: true
            }
          }
        },
        orderBy: {
          tasks: {
            _count: 'desc'
          }
        },
        take: 10
      });
      
      // Get recent user activity
      const recentActivity = await prisma.activityLog.findMany({
        orderBy: { timestamp: 'desc' },
        take: 10,
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
      
      return {
        totalUsers: Number(totalUsers),
        tasksByAssignee: tasksByAssignee.map(user => ({
          name: user.name,
          taskCount: Number(user._count.tasks)
        })),
        recentActivity: recentActivity.map(a => ({
          id: a.id.toString(),
          userId: a.userId.toString(),
          userName: a.user?.name || 'Unknown User',
          action: a.action,
          entityType: a.entityType,
          entityId: a.entityId.toString(),
          entityName: a.entityName,
          details: a.details,
          timestamp: a.timestamp.toISOString()
        }))
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },
  
  getTimeStats: async () => {
    try {
      // Get total hours logged
      const totalTimeResult = await prisma.timeEntry.aggregate({
        _sum: {
          minutes: true
        }
      });
      
      const totalHours = (totalTimeResult._sum?.minutes || 0) / 60;
      
      // Get time entries per project using raw query
      const timeByProject = await prisma.$queryRaw<any[]>`
        SELECT p.name, SUM(te.minutes) as minutes
        FROM "public"."TimeEntry" te
        JOIN "public"."Task" t ON te."taskId" = t.id
        JOIN "public"."Project" p ON t."projectId" = p.id
        GROUP BY p.id, p.name
        ORDER BY minutes DESC
        LIMIT 10
      `;
      
      // Get time entries per user using raw query
      const timeByUser = await prisma.$queryRaw<any[]>`
        SELECT u.name, SUM(te.minutes) as minutes
        FROM "public"."TimeEntry" te
        JOIN "public"."User" u ON te."userId" = u.id
        GROUP BY u.id, u.name
        ORDER BY minutes DESC
        LIMIT 10
      `;
      
      // Get recent time entries
      const recentTimeEntries = await prisma.timeEntry.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          },
          task: {
            select: {
              id: true,
              title: true,
              project: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });
      
      return {
        totalHours,
        timeByProject,
        timeByUser,
        recentTimeEntries: recentTimeEntries.map(entry => ({
          id: entry.id,
          userId: entry.userId,
          userName: entry.user?.name,
          taskId: entry.taskId,
          taskTitle: entry.task?.title,
          projectId: entry.task?.project?.id,
          projectName: entry.task?.project?.name,
          minutes: entry.minutes,
          description: entry.description,
          date: entry.date.toISOString(),
          createdAt: entry.createdAt.toISOString()
        }))
      };
    } catch (error) {
      console.error('Error fetching time stats:', error);
      throw error;
    }
  }
};

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return handleAuthError();
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'summary';
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    // Validate parameters
    if (limit > 100) {
      return errorResponse(
        'Limit cannot exceed 100 items',
        400,
        'INVALID_LIMIT'
      );
    }
    
    // Response data object
    const data: any = {};
    
    // Handle summary analytics
    if (type === 'summary') {
      try {
        const projectStats = await analyticsService.getProjectStats();
        const taskStats = await analyticsService.getTaskStats();
        const userStats = await analyticsService.getUserStats();

        // Get completed tasks count
        const completedTasksCount = taskStats.tasksByStatus.find(s => s.status === 'Completed')?.count || 0;
        const totalTasksCount = taskStats.totalTasks;

        data.analytics = {
          projects: {
            total: Number(projectStats.totalProjects),
            inProgress: Number(projectStats.projectsByStatus.find(s => s.status === 'In Progress')?.count || 0)
          },
          users: {
            total: Number(userStats.totalUsers),
            team: Number(await prisma.user.count({ where: { role: 'TEAM' } }))
          },
          tasks: {
            total: Number(taskStats.totalTasks),
            completed: Number(completedTasksCount),
            inProgress: Number(taskStats.tasksByStatus.find(s => s.status === 'In Progress')?.count || 0),
            overdue: Number(taskStats.overdueTasks),
            completion: totalTasksCount > 0 
              ? Math.round((Number(completedTasksCount) / Number(totalTasksCount)) * 100)
              : 0
          },
          budget: {
            total: Number(await prisma.project.aggregate({
              _sum: { budget: true }
            }).then(res => res._sum?.budget || 0)),
            utilization: 70 // This should be calculated based on actual expenses if you have that data
          }
        };
      } catch (error) {
        console.error('Error fetching summary analytics:', error);
        return handleDatabaseError(error);
      }
    }
    
    // Handle recent activity
    if (type === 'recent-activity') {
      try {
        const activities = await prisma.activityLog.findMany({
          take: limit,
          orderBy: { timestamp: 'desc' },
          include: {
            user: { select: { name: true } },
          }
        });
        
        data.analytics = {
          activity: activities.map((activity) => ({
            id: activity.id,
            userName: activity.user?.name || 'Unknown User',
            action: activity.action,
            entityType: activity.entityType,
            entityName: activity.entityName,
            projectName: activity.details && typeof activity.details === 'object' 
              ? (activity.details as any).projectName || null 
              : null,
            timestamp: activity.timestamp.toISOString()
          }))
        };
      } catch (error) {
        console.error('Error fetching recent activity:', error);
        return handleDatabaseError(error);
      }
    }

    // Handle other analytics types
    if (type === 'task-status') {
      try {
        const taskStats = await analyticsService.getTaskStats();
        data.analytics = {
          data: [
            { status: 'NOT_STARTED', count: taskStats.tasksByStatus.find(s => s.status === 'NOT_STARTED')?.count || 0, color: '#6B7280' },
            { status: 'IN_PROGRESS', count: taskStats.tasksByStatus.find(s => s.status === 'IN_PROGRESS')?.count || 0, color: '#3B82F6' },
            { status: 'REVIEW', count: taskStats.tasksByStatus.find(s => s.status === 'REVIEW')?.count || 0, color: '#F59E0B' },
            { status: 'COMPLETED', count: taskStats.tasksByStatus.find(s => s.status === 'COMPLETED')?.count || 0, color: '#10B981' }
          ]
        };
      } catch (error) {
        console.error('Error fetching task status analytics:', error);
        return handleDatabaseError(error);
      }
    }

    if (type === 'project-status') {
      try {
        const projectStats = await analyticsService.getProjectStats();
        data.analytics = {
          data: [
            { status: 'NOT_STARTED', count: projectStats.projectsByStatus.find(s => s.status === 'NOT_STARTED')?.count || 0, color: '#6B7280' },
            { status: 'IN_PROGRESS', count: projectStats.projectsByStatus.find(s => s.status === 'IN_PROGRESS')?.count || 0, color: '#3B82F6' },
            { status: 'ON_HOLD', count: projectStats.projectsByStatus.find(s => s.status === 'ON_HOLD')?.count || 0, color: '#F59E0B' },
            { status: 'COMPLETED', count: projectStats.projectsByStatus.find(s => s.status === 'COMPLETED')?.count || 0, color: '#10B981' }
          ]
        };
      } catch (error) {
        console.error('Error fetching project status analytics:', error);
        return handleDatabaseError(error);
      }
    }

    if (type === 'user-tasks') {
      try {
        const users = await prisma.user.findMany({
          where: { role: 'TEAM' },
          include: {
            tasks: true
          }
        });

        data.analytics = {
          data: users.map(user => ({
            user: {
              id: user.id,
              name: user.name
            },
            totalTasks: user.tasks.length,
            completedTasks: user.tasks.filter(task => task.status === 'COMPLETED').length,
            inProgressTasks: user.tasks.filter(task => task.status === 'IN_PROGRESS').length
          }))
        };
      } catch (error) {
        console.error('Error fetching user tasks analytics:', error);
        return handleDatabaseError(error);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in analytics API:', error);
    return errorResponse('Internal server error', 500);
  }
}