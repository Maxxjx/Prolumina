
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Download, FileSpreadsheet, FileText, BarChart3, PieChart } from 'lucide-react';
import { useTaskStore } from '@/stores/taskStore';
import { useUserStore } from '@/stores/userStore';
import { useActivityLogStore } from '@/stores/activityLogStore';
import { Chart } from '@/components/ui/custom-chart';

type ReportType = 'task' | 'user' | 'activity';
// Define our own DateRange type to match React Day Picker's
interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}
type ChartType = 'bar' | 'pie' | 'line';

interface ReportConfig {
  type: ReportType;
  dateRange: DateRange;
  includeCompleted: boolean;
  groupBy: string;
  chartType: ChartType;
  format: 'pdf' | 'csv' | 'chart';
}

const ReportGenerator = () => {
  const { tasks } = useTaskStore();
  const { users } = useUserStore();
  const { logs } = useActivityLogStore();
  
  const [config, setConfig] = useState<ReportConfig>({
    type: 'task',
    dateRange: { from: undefined, to: undefined },
    includeCompleted: true,
    groupBy: 'status',
    chartType: 'bar',
    format: 'chart'
  });
  
  const [date, setDate] = useState<DateRange>({ from: undefined, to: undefined });
  
  // Update config when date changes
  React.useEffect(() => {
    setConfig(prev => ({ ...prev, dateRange: date }));
  }, [date]);
  
  const handleConfigChange = (key: keyof ReportConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };
  
  const generateTaskChartData = () => {
    if (config.groupBy === 'status') {
      const statusCounts: Record<string, number> = {
        'todo': 0,
        'in-progress': 0,
        'review': 0,
        'completed': 0
      };
      
      tasks.forEach(task => {
        const status = task.status.toLowerCase().replace(' ', '-');
        if (statusCounts.hasOwnProperty(status)) {
          statusCounts[status]++;
        }
      });
      
      return [
        { name: 'To Do', value: statusCounts.todo },
        { name: 'In Progress', value: statusCounts['in-progress'] },
        { name: 'In Review', value: statusCounts.review },
        { name: 'Completed', value: statusCounts.completed }
      ];
    }
    
    return [];
  };
  
  const generateUserChartData = () => {
    const roleCounts = {
      'admin': 0,
      'team': 0,
      'client': 0
    };
    
    users.forEach(user => {
      if (roleCounts.hasOwnProperty(user.role)) {
        roleCounts[user.role]++;
      }
    });
    
    return [
      { name: 'Admins', value: roleCounts.admin },
      { name: 'Team Members', value: roleCounts.team },
      { name: 'Clients', value: roleCounts.client }
    ];
  };
  
  const generateActivityChartData = () => {
    const activityCounts = {
      'user': 0,
      'task': 0,
      'project': 0,
      'system': 0
    };
    
    logs.forEach(log => {
      if (activityCounts.hasOwnProperty(log.entityType)) {
        activityCounts[log.entityType]++;
      }
    });
    
    return [
      { name: 'User Activities', value: activityCounts.user },
      { name: 'Task Activities', value: activityCounts.task },
      { name: 'Project Activities', value: activityCounts.project },
      { name: 'System Activities', value: activityCounts.system }
    ];
  };
  
  const getChartData = () => {
    switch (config.type) {
      case 'task':
        return generateTaskChartData();
      case 'user':
        return generateUserChartData();
      case 'activity':
        return generateActivityChartData();
      default:
        return [];
    }
  };
  
  const handleGenerateReport = () => {
    // In a real app, this would generate the actual report
    console.log('Generating report with config:', config);
    // For demo purposes, we'll just show an alert
    alert('Report generated successfully! In a production app, this would download a file or show a more detailed chart.');
  };
  
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Custom Report Generator</CardTitle>
        <CardDescription>
          Create custom reports based on tasks, users, or activity logs
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label>Report Type</Label>
              <Select
                value={config.type}
                onValueChange={value => handleConfigChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="task">Task Report</SelectItem>
                  <SelectItem value="user">User Report</SelectItem>
                  <SelectItem value="activity">Activity Log Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Group By</Label>
              <Select
                value={config.groupBy}
                onValueChange={value => handleConfigChange('groupBy', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grouping" />
                </SelectTrigger>
                <SelectContent>
                  {config.type === 'task' && (
                    <>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="assignee">Assignee</SelectItem>
                    </>
                  )}
                  {config.type === 'user' && (
                    <>
                      <SelectItem value="role">Role</SelectItem>
                      <SelectItem value="tasks">Tasks Assigned</SelectItem>
                    </>
                  )}
                  {config.type === 'activity' && (
                    <>
                      <SelectItem value="entityType">Entity Type</SelectItem>
                      <SelectItem value="action">Action Type</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Date Range</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal w-full">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date.from}
                      selected={date}
                      onSelect={(range) => {
                        if (range) {
                          // Explicitly handle the type conversion
                          setDate({ 
                            from: range.from, 
                            to: range.to
                          });
                        }
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeCompleted" 
                checked={config.includeCompleted}
                onCheckedChange={checked => 
                  handleConfigChange('includeCompleted', checked === true)
                }
              />
              <Label htmlFor="includeCompleted">Include completed items</Label>
            </div>
          </div>
          
          <div className="space-y-4">
            <Label>Output Format</Label>
            <Tabs 
              defaultValue="chart" 
              value={config.format}
              onValueChange={value => handleConfigChange('format', value as 'chart' | 'pdf' | 'csv')}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chart" className="flex items-center">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Chart
                </TabsTrigger>
                <TabsTrigger value="pdf" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  PDF
                </TabsTrigger>
                <TabsTrigger value="csv" className="flex items-center">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  CSV
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="chart" className="mt-4">
                <div className="space-y-2">
                  <Label>Chart Type</Label>
                  <Select
                    value={config.chartType}
                    onValueChange={value => handleConfigChange('chartType', value as ChartType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select chart type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="pie">Pie Chart</SelectItem>
                      <SelectItem value="line">Line Chart</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="h-[200px] mt-4 border rounded-md p-2">
                    <Chart 
                      type={config.chartType}
                      data={getChartData()}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="pdf">
                <div className="p-4 rounded-md bg-muted/50 text-center text-sm text-muted-foreground">
                  PDF reports will include detailed information with custom styling and branding.
                </div>
              </TabsContent>
              
              <TabsContent value="csv">
                <div className="p-4 rounded-md bg-muted/50 text-center text-sm text-muted-foreground">
                  CSV exports can be imported into Excel, Google Sheets, or other analysis tools.
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full sm:w-auto flex items-center justify-center gap-2"
          onClick={handleGenerateReport}
        >
          <Download className="h-4 w-4" />
          Generate Report
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReportGenerator;
