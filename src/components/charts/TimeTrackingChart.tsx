'use client';

import React from 'react';
import { useTimeTrackingAnalytics } from '@/lib/hooks/useAnalytics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface TimeEntry {
  projectId: string;
  date: string;
  minutes: number;
  task?: {
    project?: {
      name: string;
    };
  };
}

interface TimeTrackingChartProps {
  title?: string;
  description?: string;
  height?: number;
  days?: number;
}

const TimeTrackingChart: React.FC<TimeTrackingChartProps> = ({
  title = 'Time Tracking',
  description = 'Hours tracked by project',
  height = 350,
  days = 30
}) => {
  const { data, isLoading, error } = useTimeTrackingAnalytics(days);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[350px] text-red-500">
            Error loading chart data
          </div>
        </CardContent>
      </Card>
    );
  }

  const timeEntries = (data?.analytics?.timeEntries || []) as TimeEntry[];
  const hoursByProject = data?.analytics?.hoursByProject || [];

  // Group time entries by project and date
  const projectData = new Map<string, { [date: string]: number }>();
  timeEntries.forEach((entry: TimeEntry) => {
    if (!entry.projectId) return;
    
    const date = new Date(entry.date).toLocaleDateString();
    const hours = entry.minutes / 60;
    
    if (!projectData.has(entry.projectId)) {
      projectData.set(entry.projectId, {});
    }
    
    const projectHours = projectData.get(entry.projectId)!;
    projectHours[date] = (projectHours[date] || 0) + hours;
  });

  // Get unique dates
  const dates = Array.from(new Set(timeEntries.map((entry: TimeEntry) => 
    new Date(entry.date).toLocaleDateString()
  ))).sort();

  // Get project names
  const projectNames = new Map<string, string>();
  timeEntries.forEach((entry: TimeEntry) => {
    if (entry.projectId && entry.task?.project?.name) {
      projectNames.set(entry.projectId, entry.task.project.name);
    }
  });

  // Prepare series data
  const series = Array.from(projectData.entries()).map(([projectId, hours]) => ({
    name: projectNames.get(projectId) || 'Unknown Project',
    data: dates.map(date => hours[date] || 0)
  }));

  const options = {
    chart: {
      type: 'area' as const,
      height,
      background: 'transparent',
      toolbar: {
        show: true
      },
      stacked: true
    },
    stroke: {
      curve: 'smooth' as const,
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: dates,
      labels: {
        style: {
          colors: '#fff'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Hours',
        style: {
          color: '#fff'
        }
      },
      labels: {
        style: {
          colors: '#fff'
        }
      }
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toFixed(1)} hours`
      }
    },
    legend: {
      position: 'top' as const,
      labels: {
        colors: '#fff'
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <Chart
          options={options}
          series={series}
              type="area"
              height={height}
            />
      </CardContent>
    </Card>
  );
};

export default TimeTrackingChart;