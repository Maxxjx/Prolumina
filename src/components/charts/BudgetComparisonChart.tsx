"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Project, TimeEntry } from '@/lib/data/types';
import { ApexOptions } from 'apexcharts';
import ChartWrapper from './ChartWrapper';

interface BudgetComparisonChartProps {
  projects: Project[];
  timeEntries: TimeEntry[];
  height?: number;
  title?: string;
  description?: string;
  enableExport?: boolean;
}

const BudgetComparisonChart: React.FC<BudgetComparisonChartProps> = ({
  projects = [],
  timeEntries = [],
  height = 350,
  title = 'Budget Comparison',
  description = 'Comparison of budgeted vs actual costs',
  enableExport = false
}) => {
  
  const chartData = useMemo(() => {
    if (!projects.length) {
      return {
        categories: [],
        budgetData: [],
        spentData: []
      };
    }

    const calculateCost = (projectId: string | number): number => {
      const projectTimeEntries = timeEntries.filter(entry =>
        (entry.projectId && entry.projectId.toString() === projectId.toString()) ||
        (entry.task && entry.task.projectId && entry.task.projectId.toString() === projectId.toString())
      );

      return projectTimeEntries.reduce((sum, entry) => {
        const hours = 'hours' in entry ? Number(entry.hours) : Number(entry.minutes || 0) / 60;
        return sum + (hours * 50); // Assuming ₹50 per hour rate
      }, 0);
    };

    const categories = projects.map(p => p.name || 'Unnamed Project');
    const budgetData = projects.map(p => Number(p.budget) || 0);
    const spentData = projects.map(p => calculateCost(p.id));

    return {
      categories,
      budgetData,
      spentData
    };
  }, [projects, timeEntries]);

  if (!projects.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[350px]">
          <p className="text-gray-400">No project data available</p>
        </CardContent>
      </Card>
    );
  }

    const chartOptions: ApexOptions = {
      chart: {
        type: 'bar',
        stacked: false,
        toolbar: {
          show: true,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 4,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: chartData.categories,
        labels: {
          style: {
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Amount (₹)',
          style: {
            fontSize: '14px',
          },
        },
        labels: {
          formatter: function (val: number) {
            return '₹' + (val / 1000).toFixed(0) + 'k';
          }        },
      },
      fill: {
        opacity: 0.9,
      },
      tooltip: {
        y: {
          formatter: function(val: number) {
            return '₹' + val.toLocaleString('en-IN');
          }
        }
      },
      legend: {
        position: 'top'
      },
    };

    const series = [
      {
      name: 'Budget',
      data: chartData.budgetData,
      type: 'bar'
      }, {
      name: 'Spent',
      data: chartData.spentData,
      type: 'bar'
      }
    ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartWrapper
          type='bar'
          series={series}
          options={chartOptions}
          height={height}
          enableExport={enableExport}
        />
      </CardContent>
    </Card>
  );
};

export default BudgetComparisonChart;
