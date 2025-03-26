'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@prisma/client';
import ChartWrapper from './ChartWrapper';

interface ProjectProgressChartProps {
  projects: Project[];
  height?: number;
  title?: string;
  description?: string;
  enableExport?: boolean;
}

const ProjectProgressChart: React.FC<ProjectProgressChartProps> = ({
  projects = [],
  height = 350,
  title = 'Project Progress',
  description = 'Visual overview of project completion status',
  enableExport = false
}) => {
  
  if (!projects.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center" style={{ height }}>
          <p className="text-gray-400">No project data available</p>
        </CardContent>
      </Card>
    );
  }

  // Format data for the chart
  const formattedData = projects.map(project => ({
    x: project.name || 'Unnamed Project',
    y: project.progress || 0,
    status: project.status
  }));

  // Color mapping based on project status
  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'NOT_STARTED': return '#94A3B8'; // gray
      case 'IN_PROGRESS': return '#6366F1'; // indigo
      case 'ON_HOLD': return '#F59E0B'; // amber
      case 'COMPLETED': return '#10B981'; // green
      case 'CANCELLED': return '#EF4444'; // red
      default: return '#CBD5E1'; // gray
    }
  };

  const series = [{
    name: 'Progress',
    data: formattedData.map(d => d.y)
  }];

  const options = {
    chart: {
      type: 'bar' as const,
      toolbar: {
        show: false
      },
      foreColor: '#64748b'
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        distributed: true,
        dataLabels: {
          position: 'middle'
        }
      }
    },
    colors: formattedData.map(d => getStatusColor(d.status)),
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val + '%';
      },
      style: {
        fontSize: '12px',
        fontWeight: 600,
        colors: ['#F8FAFC']
      }
    },
    xaxis: {
      categories: formattedData.map(d => d.x),
      labels: {
        style: {
          fontSize: '12px'
        }
      },
      min: 0,
      max: 100
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: function(val: number) {
          return val + '% complete';
        }
      }
    },
    legend: {
      show: false
    },
    grid: {
      borderColor: '#334155',
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: false
        }
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartWrapper
          type="bar"
          series={series}
          options={options}
          height={height}
          enableExport={enableExport}
        />
      </CardContent>
    </Card>
  );
};

export default ProjectProgressChart;