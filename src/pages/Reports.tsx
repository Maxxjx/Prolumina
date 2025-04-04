
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import ReportGenerator from '@/components/reports/ReportGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, PieChart, LineChart, Clock } from 'lucide-react';
import { Chart } from '@/components/ui/custom-chart';
import { useTaskStore } from '@/stores/taskStore';
import { useActivityLogStore } from '@/stores/activityLogStore';
import ActivityLog from '@/components/dashboard/ActivityLog';

const Reports = () => {
  const { tasks } = useTaskStore();
  const { logs } = useActivityLogStore();
  
  // Generate task status data for chart
  const taskStatusData = [
    { name: 'To Do', value: tasks.filter(t => t.status.toLowerCase() === 'todo').length },
    { name: 'In Progress', value: tasks.filter(t => t.status.toLowerCase() === 'in progress').length },
    { name: 'In Review', value: tasks.filter(t => t.status.toLowerCase() === 'in review').length },
    { name: 'Completed', value: tasks.filter(t => t.status.toLowerCase() === 'completed').length }
  ];
  
  // Generate activity data for chart
  const activityData = [
    { name: 'User', value: logs.filter(l => l.entityType === 'user').length },
    { name: 'Task', value: logs.filter(l => l.entityType === 'task').length },
    { name: 'Project', value: logs.filter(l => l.entityType === 'project').length },
    { name: 'System', value: logs.filter(l => l.entityType === 'system').length }
  ];
  
  return (
    <DashboardLayout title="Reports & Analytics">
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Task Status Overview</CardTitle>
              <CardDescription>Distribution of tasks by status</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[200px]">
                <Chart 
                  type="bar"
                  data={taskStatusData}
                  className="w-full h-full"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Activity Distribution</CardTitle>
              <CardDescription>Types of activities recorded</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[200px]">
                <Chart 
                  type="pie"
                  data={activityData}
                  className="w-full h-full"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
              <CardDescription>Latest system events</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 p-0">
              <ActivityLog limit={5} maxHeight="200px" showHeader={false} className="border-0 shadow-none" />
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6">
          <Tabs defaultValue="generator" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:w-auto">
              <TabsTrigger value="generator" className="flex items-center justify-center">
                <BarChart3 className="mr-2 h-4 w-4" />
                Report Generator
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center justify-center">
                <Clock className="mr-2 h-4 w-4" />
                Audit Log
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="generator" className="mt-6">
              <ReportGenerator />
            </TabsContent>
            
            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Audit Log</CardTitle>
                  <CardDescription>
                    Complete history of all actions in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivityLog limit={20} maxHeight="500px" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
