'use client';

import React from 'react';
import { useProjectStatusAnalytics } from '@/lib/hooks/useAnalytics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartDataItem {
  status: string;
  count: number;
  color: string;
}

interface ProjectStatusChartProps {
  title?: string;
  description?: string;
  height?: number;
}

const ProjectStatusChart: React.FC<ProjectStatusChartProps> = ({
  title = 'Project Status',
  description = 'Distribution of projects by status',
  height = 350
}) => {
  const { data, isLoading, error } = useProjectStatusAnalytics();

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
      type: 'bar' as const,
      height,
      background: 'transparent',
      toolbar: {
        show: true
      }
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
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: labels,
      labels: {
        style: {
          colors: '#fff'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Number of Projects',
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
    fill: {
      opacity: 1,
      colors: chartData.map(item => item.color)
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} projects`
      }
    },
    legend: {
      show: false
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
          series={[{ name: 'Projects', data: series }]}
          type="bar"
          height={height}
        />
      </CardContent>
    </Card>
  );
};

export default ProjectStatusChart; 