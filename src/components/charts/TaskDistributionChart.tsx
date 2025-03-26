'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Task, Project } from '@prisma/client';
import ChartWrapper from './ChartWrapper';

interface TaskDistributionChartProps {
  tasks: Task[];
  projects: Project[];
  height?: number;
  title?: string;
  description?: string;
  enableExport?: boolean;
}

export function TaskDistributionChart({
  tasks = [],
  projects = [],
  height = 350,
  title = 'Task Distribution',
  description = 'Distribution of tasks by status across projects',
  enableExport = false
}: TaskDistributionChartProps) {
  if (!tasks.length || !projects.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center" style={{ height }}>
          <p className="text-gray-400">No tasks data available</p>
        </CardContent>
      </Card>
    );
  }

  // Create map for project lookups
  const projectMap = new Map<string, string>();
  projects.forEach(project => {
    projectMap.set(project.id.toString(), project.name);
  });

  // Count tasks by status
  const statusCounts = {
    'NOT_STARTED': 0,
    'IN_PROGRESS': 0,
    'REVIEW': 0,
    'COMPLETED': 0
  };

  tasks.forEach(task => {
    if (task.status in statusCounts) {
      statusCounts[task.status as keyof typeof statusCounts]++;
    }
  });

  // Count tasks by project and status
  const projectTaskCounts = new Map<string, { [key: string]: number }>();
  
  projects.forEach(project => {
    projectTaskCounts.set(project.id.toString(), {
      'NOT_STARTED': 0,
      'IN_PROGRESS': 0,
      'REVIEW': 0,
      'COMPLETED': 0
    });
  });

  tasks.forEach(task => {
    if (task.projectId && projectTaskCounts.has(task.projectId.toString())) {
      const projectCounts = projectTaskCounts.get(task.projectId.toString());
      if (projectCounts && task.status in projectCounts) {
        projectCounts[task.status as keyof typeof statusCounts]++;
      }
    }
  });

  // Chart configuration for donut chart
  const donutOptions = {
    chart: {
      type: 'donut' as const,
      foreColor: '#64748b',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
            },
            value: {
              show: true,
              formatter: function(value: any) {
                return value.toString();
              }
            },
            total: {
              show: true,
              label: 'Total Tasks',
              formatter: function() {
                return tasks.length.toString();
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      position: 'bottom' as const,
      horizontalAlign: 'center' as const,
      fontSize: '14px'
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} tasks`
      }
    },
    theme: {
      mode: 'dark' as const
    }
  };

  const donutSeries = Object.values(statusCounts);
  const donutLabels = Object.keys(statusCounts).map(status => 
    status.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')
  );

  // Chart configuration for bar chart
  const barOptions = {
    chart: {
      type: 'bar' as const,
      stacked: true,
      foreColor: '#64748b'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%',
        borderRadius: 2
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: Array.from(projectTaskCounts.keys()).map(id => projectMap.get(id) || 'Unknown'),
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Number of Tasks'
      }
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} tasks`
      }
    },
    theme: {
      mode: 'dark' as const
    }
  };

  const statuses = ['NOT_STARTED', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'];
  const statusLabels = [
    'Not Started',
    'In Progress',
    'Review',
    'Completed'
  ];

  const barSeries = statuses.map((status, index) => ({
    name: statusLabels[index],
    data: Array.from(projectTaskCounts.values()).map(counts => counts[status])
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-medium mb-3">Status Distribution</h3>
            <ChartWrapper
              type="donut"
              options={{
                ...donutOptions,
                labels: donutLabels
              }}
              series={donutSeries}
              height={height}
              enableExport={enableExport}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-3">Project-wise Distribution</h3>
            <ChartWrapper
              type="bar"
              options={barOptions}
              series={barSeries}
              height={height}
              enableExport={enableExport}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TaskDistributionChart;