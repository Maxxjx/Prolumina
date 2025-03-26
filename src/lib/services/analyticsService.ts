import { prisma } from '@/lib/prisma';
import { Project, Task, TimeEntry, User } from '@prisma/client';

interface TaskStats {
  totalTasks: number;
  tasksByStatus: Array<{ status: string; count: number }>;
  overdueTasks: number;
}

interface ProjectStats {
  totalProjects: number;
  projectsByStatus: Array<{ status: string; count: number }>;
  recentProjects: Project[];
}

interface UserStats {
  totalUsers: number;
  usersByRole: Array<{ role: string; count: number }>;
  recentUsers: User[];
}

interface TimeStats {
  timeEntries: TimeEntry[];
  totalHours: number;
  hoursByProject: Array<{ projectId: string; _sum: { minutes: number | null } }>;
}

interface BudgetStats {
  projectId: string;
  projectName: string;
  budget: number | null;
  actualCost: number;
  variance: number;
}

export const analyticsService = {
  async getProjectStats(): Promise<ProjectStats> {
    const totalProjects = await prisma.project.count();
    const projectsByStatus = await prisma.project.groupBy({
      by: ['status'],
      _count: true
    });
    const recentProjects = await prisma.project.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        client: true,
        tasks: true
      }
    });

    return {
      totalProjects,
      projectsByStatus: projectsByStatus.map(stat => ({
        status: stat.status,
        count: stat._count
      })),
      recentProjects
    };
  },

  async getTaskStats(): Promise<TaskStats> {
    const totalTasks = await prisma.task.count();
    const tasksByStatus = await prisma.task.groupBy({
      by: ['status'],
      _count: true
    });
    const overdueTasks = await prisma.task.count({
      where: {
        deadline: {
          lt: new Date()
        },
        status: {
          not: 'COMPLETED'
        }
      }
    });

    return {
      totalTasks,
      tasksByStatus: tasksByStatus.map(stat => ({
        status: stat.status,
        count: stat._count
      })),
      overdueTasks
    };
  },

  async getUserStats(): Promise<UserStats> {
    const totalUsers = await prisma.user.count();
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: true
    });
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    return {
      totalUsers,
      usersByRole: usersByRole.map(stat => ({
        role: stat.role,
        count: stat._count
      })),
      recentUsers
    };
  },

  async getTimeStats(startDate: Date, endDate: Date): Promise<TimeStats> {
    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        task: {
          include: {
            project: true
          }
        },
        user: true
      }
    });

    const totalHours = timeEntries.reduce((sum, entry) => sum + entry.minutes / 60, 0);
    const hoursByProject = await prisma.timeEntry.groupBy({
      by: ['taskId'],
      _sum: {
        minutes: true
      }
    });

    // Map taskId to projectId
    const projectHours = await Promise.all(
      hoursByProject.map(async (stat) => {
        const task = await prisma.task.findUnique({
          where: { id: stat.taskId },
          select: { projectId: true }
        });
        return {
          projectId: task?.projectId || '',
          _sum: stat._sum
        };
      })
    );

    return {
      timeEntries,
      totalHours,
      hoursByProject: projectHours
    };
  },

  async getBudgetStats(): Promise<{
    totalBudget: number;
    totalActualCost: number;
    totalVariance: number;
    projectStats: BudgetStats[];
  }> {
    const projects = await prisma.project.findMany({
      include: {
        tasks: {
          include: {
            timeEntries: true
          }
        }
      }
    });

    const budgetStats = projects.map(project => {
      const totalHours = project.tasks.reduce((sum, task) => {
        return sum + task.timeEntries.reduce((taskSum, entry) => taskSum + entry.minutes / 60, 0);
      }, 0);

      const actualCost = totalHours * 100; // Assuming $100 per hour rate
      const budget = project.budget || 0;

      return {
        projectId: project.id.toString(),
        projectName: project.name,
        budget,
        actualCost,
        variance: budget - actualCost
      };
    });

    return {
      totalBudget: projects.reduce((sum, project) => sum + (project.budget || 0), 0),
      totalActualCost: budgetStats.reduce((sum, stat) => sum + stat.actualCost, 0),
      totalVariance: budgetStats.reduce((sum, stat) => sum + stat.variance, 0),
      projectStats: budgetStats
    };
  }
}; 