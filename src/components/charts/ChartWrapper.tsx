'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { theme } from '@/lib/utils/theme';

// Dynamically import ApexCharts with no SSR to avoid hydration issues
const Chart = dynamic(() => import('react-apexcharts'), { 
  ssr: false,
  loading: () => (
    <div className="animate-pulse flex flex-col items-center gap-2">
      <div className="h-8 w-8 rounded-full border-2 border-t-transparent border-purple-500 animate-spin"></div>
      <div className="text-gray-400 text-sm">Loading chart...</div>
    </div>
  )
});

interface ChartWrapperProps {
  type: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'candlestick' | 'boxPlot' | 'radar' | 'polarArea' | 'rangeBar';
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  options: ApexCharts.ApexOptions;
  width?: string | number;
  height?: string | number;
  className?: string;
  enableExport?: boolean;
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({
  type,
  series,
  options,
  width = '100%',
  height = 350,
  className = '',
  enableExport = false,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Merge default options with provided options
  const defaultOptions: ApexCharts.ApexOptions = {
    theme: {
      mode: 'dark',
      palette: 'palette1',
    },
    chart: {
      background: theme.chartTheme.background,
      foreColor: theme.chartTheme.text,
      fontFamily: theme.typography.fontFamily.sans,
      toolbar: {
        show: enableExport,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
        export: {
          csv: {
            filename: undefined,
            columnDelimiter: ',',
            headerCategory: 'Category',
            headerValue: 'Value',
          },
          svg: {
            filename: undefined,
          },
          png: {
            filename: undefined,
          }
        },
      },
      zoom: {
        enabled: false,
      },
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
    },
    colors: theme.chartTheme.colors,
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: theme.typography.fontSize.sm,
        fontFamily: theme.typography.fontFamily.sans,
      },
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        return `<div class="bg-gray-800 border border-gray-700 p-2 rounded-lg shadow-lg">
          <div class="text-gray-200">${w.globals.labels[dataPointIndex]}</div>
          <div class="text-gray-400">${series[seriesIndex][dataPointIndex]}</div>
        </div>`;
      }
    },
    grid: {
      show: true,
      borderColor: theme.chartTheme.grid,
      strokeDashArray: 4,
      position: 'back',
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: enableExport ? 20 : 0,
        right: 8,
        bottom: 0,
        left: 12
      },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
      lineCap: 'round',
    },
    xaxis: {
      labels: {
        style: {
          colors: theme.chartTheme.text,
          fontSize: theme.typography.fontSize.sm,
          fontFamily: theme.typography.fontFamily.sans,
        }
      },
      axisBorder: {
        show: true,
        color: theme.chartTheme.grid,
      },
      axisTicks: {
        show: true,
        color: theme.chartTheme.grid,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.chartTheme.text,
          fontSize: theme.typography.fontSize.sm,
          fontFamily: theme.typography.fontFamily.sans,
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetY: enableExport ? 12 : -4,
      labels: {
        colors: theme.chartTheme.text,
      },
      markers: {
        size: 8,
        shape: 'circle',
        offsetX: 2,
      },
      itemMargin: {
        horizontal: 12,
        vertical: 5
      },
      onItemClick: {
        toggleDataSeries: true
      },
      onItemHover: {
        highlightDataSeries: true
      },
    },
    dataLabels: {
      style: {
        fontSize: theme.typography.fontSize.sm,
        fontFamily: theme.typography.fontFamily.sans,
        colors: [theme.chartTheme.text]
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%',
        dataLabels: {
          position: 'top'
        },
      },
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: theme.typography.fontSize.base,
              fontFamily: theme.typography.fontFamily.sans,
              color: theme.chartTheme.text,
            },
            value: {
              show: true,
              fontSize: theme.typography.fontSize.xl,
              fontFamily: theme.typography.fontFamily.sans,
              color: theme.chartTheme.text,
            },
            total: {
              show: true,
              fontSize: theme.typography.fontSize.base,
              fontFamily: theme.typography.fontFamily.sans,
              color: theme.chartTheme.text,
            }
          }
        }
      }
    },
    ...options,
  };

  if (typeof window === 'undefined' || !mounted) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-900 rounded-xl shadow-md ${className}`} 
        style={{ width, height }}
      >
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full border-2 border-t-transparent border-purple-500 animate-spin"></div>
          <div className="text-gray-400 text-sm">Loading chart...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-900 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <Chart
        type={type}
        series={series}
        options={defaultOptions}
        width={width}
        height={height}
      />
    </div>
  );
};

export default ChartWrapper;