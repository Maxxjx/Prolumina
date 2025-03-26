'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  ProjectProgressChart,
  TaskDistributionChart,
  TimeTrackingChart,
  BudgetComparisonChart,
  TeamPerformanceChart
} from '../charts';
import { useProjects } from '@/lib/hooks/useProjects';
import { useTasks } from '@/lib/hooks/useTasks';
import { useTimeEntriesInRange } from '@/lib/hooks/useTimeTracking';
import { useUsers } from '@/lib/hooks/useUsers';
import { format, subDays } from 'date-fns';
import { Project, Task, TimeEntry } from '@prisma/client';

const ReportCharts: React.FC = () => {
  const [dateRange, setDateRange] = useState<string>('week');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const { data: session } = useSession();
  
  // Fetch data using hooks
  const today = new Date();
  const startDate = format(subDays(today, 30), 'yyyy-MM-dd');
  const endDate = format(today, 'yyyy-MM-dd');
  
  const { data: projects = [], isLoading: isLoadingProjects } = useProjects();
  const { data: tasks = [], isLoading: isLoadingTasks } = useTasks();
  const { data: timeEntries = [], isLoading: isLoadingTimeEntries } = useTimeEntriesInRange(startDate, endDate);
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();

  const isLoading = isLoadingProjects || isLoadingTasks || isLoadingTimeEntries || isLoadingUsers;
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Advanced Analytics</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Date Range</label>
            <select 
              className="bg-[#1F2937] border border-gray-700 rounded py-2 px-3 w-full sm:w-auto"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Project</label>
            <select 
              className="bg-[#1F2937] border border-gray-700 rounded py-2 px-3 w-full sm:w-auto"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="all">All Projects</option>
              {projects.map((project: Project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Project Progress Section */}
      <div className="bg-[#111827] rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Project Progress</h3>
        <ProjectProgressChart 
          projects={projects}
          height={400}
          enableExport={true}
        />
      </div>
      
      {/* Task Distribution Section */}
      <div className="bg-[#111827] rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Task Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TaskDistributionChart 
            tasks={tasks}
            projects={projects}
            height={350}
            enableExport={true}
          />
          <div>
            <h4 className="text-lg font-medium mb-3">Task Insights</h4>
            <div className="space-y-4">
              <div className="bg-[#1F2937] p-4 rounded">
                <div className="text-sm text-gray-400">Total Tasks</div>
                <div className="text-2xl font-bold">{tasks.length}</div>
              </div>
              <div className="bg-[#1F2937] p-4 rounded">
                <div className="text-sm text-gray-400">Completion Rate</div>
                <div className="text-2xl font-bold text-green-500">
                  {Math.round((tasks.filter((t: Task) => t.status === 'COMPLETED').length / tasks.length) * 100)}%
                </div>
              </div>
              <div className="bg-[#1F2937] p-4 rounded">
                <div className="text-sm text-gray-400">Avg. Resolution Time</div>
                <div className="text-2xl font-bold">3.2 days</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Time Tracking Section */}
      <div className="bg-[#111827] rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Time Tracking</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <TimeTrackingChart 
              timeEntries={timeEntries}
              projects={projects}
              users={users}
              height={350}
              enableExport={true}
            />
          </div>
          <div>
            <h4 className="text-lg font-medium mb-3">Time Summary</h4>
            <div className="space-y-4">
              <div className="bg-[#1F2937] p-4 rounded">
                <div className="text-sm text-gray-400">Total Hours</div>
                <div className="text-2xl font-bold">
                  {Math.round(timeEntries.reduce((sum: number, entry: TimeEntry) => sum + (entry.minutes || 0) / 60, 0))}
                </div>
              </div>
              <div className="bg-[#1F2937] p-4 rounded">
                <div className="text-sm text-gray-400">Billable Hours</div>
                <div className="text-2xl font-bold">
                  {Math.round(timeEntries.filter((e: TimeEntry) => e.billable).reduce((sum: number, entry: TimeEntry) => sum + (entry.minutes || 0) / 60, 0))}
                </div>
              </div>
              <div className="bg-[#1F2937] p-4 rounded">
                <div className="text-sm text-gray-400">Productivity</div>
                <div className="text-2xl font-bold text-purple-500">83%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Budget Section */}
      <div className="bg-[#111827] rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Budget Analysis</h3>
        <BudgetComparisonChart 
          projects={projects}
          timeEntries={timeEntries}
          height={400}
          enableExport={true}
        />
      </div>
      
      {/* Team Performance Section */}
      <div className="bg-[#111827] rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Team Performance</h3>
        <TeamPerformanceChart 
          users={users}
          tasks={tasks}
          timeEntries={timeEntries}
          height={400}
          enableExport={true}
        />
      </div>
    </div>
  );
};

export default ReportCharts;