'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ProjectProgressChart,
  TaskDistributionChart,
  TimeTrackingChart,
  BudgetComparisonChart,
  TeamPerformanceChart
} from '../charts';
import { useProjects } from '@/lib/hooks/useProjects';
import { useTasks } from '@/lib/hooks/useTasks';
import { useTimeEntriesInRange } from '@/lib/hooks/useTimeTracking';
import { useUsers } from '@/lib/hooks/useUsers';
import { format, subDays } from 'date-fns';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardCharts: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'user';
  const userId = session?.user?.id;

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get data for charts with a 30-day window
  const today = new Date();
  const startDate = format(subDays(today, 30), 'yyyy-MM-dd');
  const endDate = format(today, 'yyyy-MM-dd');
  
  const { data: projects = [], isLoading: isLoadingProjects } = useProjects();
  const { data: tasks = [], isLoading: isLoadingTasks } = useTasks();
  const { data: timeEntries = [], isLoading: isLoadingTimeEntries } = useTimeEntriesInRange(startDate, endDate);
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();

  // Transform time entries data (convert minutes to hours)
  const transformedTimeEntries = timeEntries.map(entry => ({
    ...entry,
    hours: entry.minutes ? entry.minutes / 60 : 0
  }));

  // Filter data based on user role
  const roleFilteredProjects = projects.filter((project) => {
    if (userRole === 'client' && userId) {
      return project.clientId === userId;
    }
    return true;
  });

  const roleFilteredTasks = tasks.filter((task) => {
    if (userRole === 'team' && userId) {
      return task.assigneeId === userId;
    }
    if (userRole === 'client' && userId) {
      return roleFilteredProjects.some(p => p.id === task.projectId);
    }
    return true;
  });

  const roleFilteredTimeEntries = transformedTimeEntries.filter((entry) => {
    if (userRole === 'team' && userId) {
      return entry.userId === userId;
    }
    if (userRole === 'client' && userId) {
      return roleFilteredProjects.some(p => p.id === (entry.projectId || entry.task?.projectId));
    }
    return true;
  });

  const isLoading = !isClient || isLoadingProjects || isLoadingTasks || isLoadingTimeEntries || isLoadingUsers;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">
          {userRole === 'admin' ? 'Administrator Dashboard' : 
           userRole === 'team' ? 'Team Member Dashboard' : 
           'Client Dashboard'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full">
              <CardHeader>
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="w-full">
              <CardHeader>
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[350px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Get charts based on user role
  const getCharts = () => {
    const charts = {
      topRow: [] as React.ReactNode[],
      bottomRow: [] as React.ReactNode[]
    };

    // Admin gets all charts
    if (userRole === 'admin') {
      charts.topRow = [
        <Card key="task-distribution">
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
            <CardDescription>Overview of task status across projects</CardDescription>
          </CardHeader>
          <CardContent>
            <TaskDistributionChart 
              tasks={roleFilteredTasks}
              projects={roleFilteredProjects}
              height={300}
            />
          </CardContent>
        </Card>,
        <Card key="time-tracking">
          <CardHeader>
            <CardTitle>Time Tracking</CardTitle>
            <CardDescription>Time spent on projects across the team</CardDescription>
          </CardHeader>
          <CardContent>
            <TimeTrackingChart 
              timeEntries={roleFilteredTimeEntries}
              projects={roleFilteredProjects}
              users={users}
              height={300}
            />
          </CardContent>
        </Card>,
        <Card key="team-performance">
          <CardHeader>
            <CardTitle>Team Overview</CardTitle>
            <CardDescription>Team productivity and performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <TeamPerformanceChart 
              users={users}
              tasks={roleFilteredTasks}
              timeEntries={roleFilteredTimeEntries}
              height={300}
            />
          </CardContent>
        </Card>
      ];
      
      charts.bottomRow = [
        <Card key="project-progress">
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>Status and completion of all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectProgressChart 
              projects={roleFilteredProjects}
              height={350}
            />
          </CardContent>
        </Card>,
        <Card key="budget-comparison">
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
            <CardDescription>Budget utilization across projects</CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetComparisonChart 
              projects={roleFilteredProjects}
              timeEntries={roleFilteredTimeEntries}
              height={350}
            />
          </CardContent>
        </Card>
      ];
    }
    // Team member gets task-focused charts
    else if (userRole === 'team') {
      charts.topRow = [
        <Card key="task-distribution">
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
            <CardDescription>Distribution of your assigned tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <TaskDistributionChart 
              tasks={roleFilteredTasks}
              projects={roleFilteredProjects}
              height={300}
            />
          </CardContent>
        </Card>,
        <Card key="time-tracking">
          <CardHeader>
            <CardTitle>My Time Tracking</CardTitle>
            <CardDescription>Your logged hours by project</CardDescription>
          </CardHeader>
          <CardContent>
            <TimeTrackingChart 
              timeEntries={roleFilteredTimeEntries}
              projects={roleFilteredProjects}
              users={users}
              height={300}
            />
          </CardContent>
        </Card>
      ];
      
      charts.bottomRow = [
        <Card key="project-progress">
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>Status of projects you're working on</CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectProgressChart 
              projects={roleFilteredProjects}
              height={350}
            />
          </CardContent>
        </Card>
      ];
    }
    // Client gets project-focused charts
    else if (userRole === 'client') {
      charts.topRow = [
        <Card key="project-progress">
          <CardHeader>
            <CardTitle>Your Projects</CardTitle>
            <CardDescription>Current progress of your projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectProgressChart 
              projects={roleFilteredProjects}
              height={300}
            />
          </CardContent>
        </Card>,
        <Card key="task-distribution">
          <CardHeader>
            <CardTitle>Project Tasks</CardTitle>
            <CardDescription>Status of tasks across your projects</CardDescription>
          </CardHeader>
          <CardContent>
            <TaskDistributionChart 
              tasks={roleFilteredTasks}
              projects={roleFilteredProjects}
              height={300}
            />
          </CardContent>
        </Card>
      ];
      
      charts.bottomRow = [
        <Card key="budget-comparison">
          <CardHeader>
            <CardTitle>Budget Status</CardTitle>
            <CardDescription>Budget vs actual spending on your projects</CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetComparisonChart 
              projects={roleFilteredProjects}
              timeEntries={roleFilteredTimeEntries}
              height={350}
            />
          </CardContent>
        </Card>
      ];
    }
    
    return charts;
  };

  const charts = getCharts();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        {userRole === 'admin' ? 'Administrator Dashboard' : 
         userRole === 'team' ? 'Team Member Dashboard' : 
         'Client Dashboard'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charts.topRow}
      </div>
      
      {charts.bottomRow.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {charts.bottomRow}
        </div>
      )}
    </div>
  );
};

export default DashboardCharts;