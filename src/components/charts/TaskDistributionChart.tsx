'use client';

import React from 'react';
import { useTaskStatusAnalytics } from '@/lib/hooks/useAnalytics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartDataItem {
  status: string;
  count: number;
  color: string;
}

interface TaskDistributionChartProps {
  title?: string;
  description?: string;
  height?: number;
}

const TaskDistributionChart: React.FC<TaskDistributionChartProps> = ({
  title = 'Task Distribution',
  description = 'Distribution of tasks by status',
  height = 350
}) => {
  const { data, isLoading, error } = useTaskStatusAnalytics();

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

  const chartData = (data?.analytics?.data || []) as ChartDataItem[];
  const labels = chartData.map(item => item.status);
  const series = chartData.map(item => item.count);

  const options = {
    chart: {
      type: 'donut' as const,
      height,
      background: 'transparent'
    },
    labels,
    colors: chartData.map(item => item.color),
    legend: {
      position: 'bottom' as const,
      labels: {
        colors: '#fff'
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
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
          type="donut"
          height={height}
        />
      </CardContent>
    </Card>
  );
};

export default TaskDistributionChart; 