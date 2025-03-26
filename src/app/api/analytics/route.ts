import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Prisma } from '@prisma/client';
import { errorResponse, handleDatabaseError, handleAuthError } from '@/lib/api-utils';

interface StatusCount {
  status: string;
  count: number;
}

interface ProjectStats {
  totalProjects: number;
  projectsByStatus: StatusCount[];
  projectsByPriority: StatusCount[];
  recentProjects: any[];
}

interface TaskStats {
  totalTasks: number;
  tasksByStatus: StatusCount[];
  tasksByPriority: StatusCount[];
  overdueTasks: number;
  upcomingTasks: number;
}

interface UserStats {
  totalUsers: number;
  tasksByAssignee: any[];
  recentActivity: any[];
}

// Analytics service with database implementation
const analyticsService = {
  getProjectStats: async (): Promise<ProjectStats> => {
    try {
      // Get total count of projects
      const totalProjects = await prisma.project.count();
      
      // Get projects by status using raw query
      const projectsByStatus = await prisma.$queryRaw<StatusCount[]>`
        SELECT status, COUNT(*) as count 
        FROM "public"."Project" 
        GROUP BY status
      `;
      
      // Get projects by priority using raw query
      const projectsByPriority = await prisma.$queryRaw<StatusCount[]>`
        SELECT priority, COUNT(*) as count 
        FROM "public"."Project" 
        GROUP BY priority
      `;
      
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
        totalProjects,
        projectsByStatus,
        projectsByPriority,
        recentProjects: recentProjects.map(p => ({
          ...p,
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
      
      // Get tasks by status using raw query
      const tasksByStatus = await prisma.$queryRaw<StatusCount[]>`
        SELECT status, COUNT(*) as count 
        FROM "public"."Task" 
        GROUP BY status
      `;
      
      // Get tasks by priority using raw query
      const tasksByPriority = await prisma.$queryRaw<StatusCount[]>`
        SELECT priority, COUNT(*) as count 
        FROM "public"."Task" 
        GROUP BY priority
      `;
      
      // Get overdue tasks
      const today = new Date();
      const overdueTasks = await prisma.task.count({
        where: {
          deadline: { lt: today },
          status: { not: 'completed' }
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
          status: { not: 'completed' }
        }
      });
      
      return {
        totalTasks,
        tasksByStatus,
        tasksByPriority,
        overdueTasks,
        upcomingTasks
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
      
      // Get tasks by assignee using raw query
      const tasksByAssignee = await prisma.$queryRaw<any[]>`
        SELECT u.name, COUNT(t.id) as taskCount
        FROM "public"."User" u
        LEFT JOIN "public"."Task" t ON u.id = t."assigneeId"
        GROUP BY u.id, u.name
        ORDER BY taskCount DESC
        LIMIT 10
      `;
      
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
        totalUsers,
        tasksByAssignee,
        recentActivity: recentActivity.map(a => ({
          id: a.id,
          userId: a.userId,
          userName: a.user?.name,
          action: a.action,
          entityType: a.entityType,
          entityId: a.entityId,
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

        data.analytics = {
          projects: {
            total: projectStats.totalProjects,
            inProgress: projectStats.projectsByStatus.find(s => s.status === 'in-progress')?.count || 0
          },
          users: {
            total: userStats.totalUsers,
            team: await prisma.user.count({ where: { role: 'TEAM' } })
          },
          tasks: {
            total: taskStats.totalTasks,
            completed: taskStats.tasksByStatus.find(s => s.status === 'COMPLETED')?.count || 0,
            inProgress: taskStats.tasksByStatus.find(s => s.status === 'IN_PROGRESS')?.count || 0,
            overdue: taskStats.overdueTasks,
            completion: taskStats.totalTasks > 0 
              ? Math.round((taskStats.tasksByStatus.find(s => s.status === 'COMPLETED')?.count || 0) / taskStats.totalTasks * 100)
              : 0
          },
          budget: {
            total: await prisma.project.aggregate({
              _sum: { budget: true }
            }).then(res => res._sum?.budget || 0),
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
    return errorResponse(
      'An unexpected error occurred',
      500,
      'SERVER_ERROR'
    );
  }
}