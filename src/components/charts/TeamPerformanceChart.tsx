'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, TimeEntry, Task } from '@prisma/client';
import ChartWrapper from './ChartWrapper';

interface TeamPerformanceChartProps {
  users?: User[];
  timeEntries?: TimeEntry[];
  tasks?: Task[];
  height?: number;
  title?: string;
  description?: string;
  enableExport?: boolean;
}

export function TeamPerformanceChart({
  users = [],
  timeEntries = [],
  tasks = [],
  height = 350,
  title = 'Team Performance',
  description = 'Analysis of team performance metrics',
  enableExport = false
}: TeamPerformanceChartProps) {
  
  const chartData = useMemo(() => {
    if (!users.length || !timeEntries.length || !tasks.length) {
      return {
        userNames: [],
        taskCompletionRates: [],
        timeSpent: [],
        avgTaskCompletionTime: []
      };
    }

    // Process data for each user
    const userData = users.map(user => {
      const userTasks = tasks.filter(task => task.assigneeId === user.id);
      const userTimeEntries = timeEntries.filter(entry => entry.userId === user.id);
      
      // Calculate task completion rate
      const completedTasks = userTasks.filter(task => task.status === 'COMPLETED').length;
      const completionRate = userTasks.length > 0 
        ? (completedTasks / userTasks.length) * 100 
        : 0;

      // Calculate total time spent (convert minutes to hours)
      const totalHours = userTimeEntries.reduce((sum, entry) => {
        const hours = entry.minutes ? entry.minutes / 60 : 0;
        return sum + hours;
      }, 0);

      // Calculate average task completion time (in hours)
      const avgCompletionTime = completedTasks > 0
        ? userTimeEntries.reduce((sum, entry) => sum + (entry.minutes || 0) / 60, 0) / completedTasks
        : 0;

      return {
        name: user.name || 'Unknown User',
        completionRate,
        timeSpent: totalHours,
        avgCompletionTime
      };
    });

    return {
      userNames: userData.map(d => d.name),
      taskCompletionRates: userData.map(d => d.completionRate),
      timeSpent: userData.map(d => d.timeSpent),
      avgTaskCompletionTime: userData.map(d => d.avgCompletionTime)
    };
  }, [users, timeEntries, tasks]);

  if (!users?.length || !timeEntries?.length || !tasks?.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center" style={{ height }}>
          <p className="text-gray-400">No team performance data available</p>
        </CardContent>
      </Card>
    );
  }

  const barOptions = {
    chart: {
      type: 'bar' as const,
      stacked: false,
      foreColor: '#64748b'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: chartData.userNames,
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: [
      {
        title: {
          text: 'Completion Rate (%)'
        },
        labels: {
          formatter: (val: number) => `${val.toFixed(0)}%`
        }
      },
      {
        opposite: true,
        title: {
          text: 'Hours'
        },
        labels: {
          formatter: (val: number) => `${val.toFixed(1)}h`
        }
      }
    ],
    tooltip: {
      shared: true,
      intersect: false
    },
    theme: {
      mode: 'dark' as const
    }
  };

  const barSeries = [
    {
      name: 'Task Completion Rate',
      type: 'column',
      data: chartData.taskCompletionRates
    },
    {
      name: 'Time Spent',
      type: 'line',
      data: chartData.timeSpent
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <h3 className="text-sm font-medium mb-3">Performance Overview</h3>
          <ChartWrapper
            type="bar"
            options={barOptions}
            series={barSeries}
            height={height}
            enableExport={enableExport}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default TeamPerformanceChart;