import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  BarChart, 
  LineChart, 
  Line,
  Area, 
  AreaChart, 
  ReferenceArea, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
  RadialBar,
  RadialBarChart,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import GlassCard from '@/components/ui/GlassCard';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useProjectStore } from '@/stores/projectStore';
import { useTaskStore } from '@/stores/taskStore';
import { useUserStore } from '@/stores/userStore';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarRange, 
  Clock, 
  ArrowUpRight, 
  Users, 
  CheckSquare, 
  AlertCircle, 
  ArrowRight, 
  BarChart as BarChartIcon, 
  TrendingUp,
  Calendar,
  Layers,
  Timer,
  Target,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import StatsCard from './StatsCard';
import ActivityItem from './ActivityItem';

export function DashboardTabs() {
  const { isAdmin, isTeam, user } = useAuth();
  const { stats, sprintPerformanceData, loading } = useDashboardStore();
  const { projects, fetchProjects, loading: projectsLoading } = useProjectStore();
  const { tasks, fetchTasks, loading: tasksLoading } = useTaskStore();
  const { users, fetchUsers, loading: usersLoading } = useUserStore();
  const [timeRange, setTimeRange] = useState("3M"); // Default time range

  useEffect(() => {
    if (isTeam) {
      fetchTasks();
    }
    
    fetchProjects();
    
    if (isAdmin) {
      fetchUsers();
    }
  }, [fetchProjects, fetchTasks, fetchUsers, isAdmin, isTeam]);
  
  // Filter tasks to only include those assigned to the current user
  const myTasks = tasks.filter(task => 
    task.assignedTo && task.assignedTo.some(assignee => assignee.id === user?.id)
  );
  
  // Calculate task completion rate
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const todoTasks = tasks.filter(task => task.status === 'todo').length;
  const reviewTasks = tasks.filter(task => task.status === 'review').length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  
  // Status distribution data for pie chart
  const statusData = [
    { name: 'Completed', value: completedTasks, color: '#22c55e' },
    { name: 'In Progress', value: inProgressTasks, color: '#3b82f6' },
    { name: 'To Do', value: todoTasks, color: '#6b7280' },
    { name: 'In Review', value: reviewTasks, color: '#f59e0b' },
  ].filter(item => item.value > 0);

  // Project status data
  const activeProjects = projects.filter(p => p.status !== 'Completed').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const onHoldProjects = projects.filter(p => p.status === 'On Hold').length;

  // Time range options for charts
  const timeRangeOptions = [
    { value: "1M", label: "1 Month" },
    { value: "3M", label: "3 Months" },
    { value: "6M", label: "6 Months" },
    { value: "1Y", label: "1 Year" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.8 }
    }
  };
  
  // Productivity score - simulated data
  const productivityScore = 78;
  
  // Data for radial bar chart
  const radialData = [
    {
      name: 'Task Completion',
      value: completionRate,
      fill: '#8b5cf6',
    },
    {
      name: 'Project Progress',
      value: 72,
      fill: '#3b82f6',
    },
    {
      name: 'Team Utilization',
      value: 85,
      fill: '#22c55e',
    },
  ];

  // Sample activities - replace with real data
  const activities = [
    {
      avatar: "M",
      name: "Michael Johnson",
      action: "completed task",
      target: "Update dashboard UI components",
      time: "35 min ago",
      color: "bg-green-500"
    },
    {
      avatar: "S",
      name: "Stephanie Lee",
      action: "created project",
      target: "Q4 Marketing Campaign",
      time: "2 hours ago",
      color: "bg-blue-500"
    },
    {
      avatar: "A",
      name: "Alex Wilson",
      action: "commented on",
      target: "Mobile app redesign",
      time: "Yesterday at 15:32",
      color: "bg-amber-500"
    },
    {
      avatar: "J",
      name: "Jessica Miller",
      action: "assigned task to",
      target: "Chris Thompson",
      time: "Yesterday at 10:15",
      color: "bg-purple-500"
    }
  ];
  
  return (
    <div className="space-y-8">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 bg-dark-400/80 backdrop-blur-sm shadow-lg border border-white/5 rounded-lg">
          <TabsTrigger value="overview" className="transition-all data-[state=active]:bg-pulse-600 data-[state=active]:text-white">
            <div className="flex items-center">
              <BarChartIcon className="h-4 w-4 mr-2" />
              Overview
            </div>
          </TabsTrigger>
          <TabsTrigger value="projects" className="transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <div className="flex items-center">
              <Layers className="h-4 w-4 mr-2" />
              Projects
            </div>
          </TabsTrigger>
          {isTeam && (
            <TabsTrigger value="tasks" className="transition-all data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <div className="flex items-center">
                <CheckSquare className="h-4 w-4 mr-2" />
                Tasks
              </div>
            </TabsTrigger>
          )}
          {isAdmin && (
            <TabsTrigger value="team" className="transition-all data-[state=active]:bg-yellow-600 data-[state=active]:text-white">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Team
              </div>
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <StatsCard 
              icon={<CheckSquare className="h-6 w-6" />} 
              title="Total Tasks" 
              value={tasks.length.toString()} 
              subtitle={`${completedTasks} completed`}
              color="bg-gradient-to-br from-purple-500 to-purple-700"
              loading={tasksLoading}
              trend="up"
              trendValue="+12.5%"
              animationDelay={0.1}
            />
            <StatsCard 
              icon={<Users className="h-6 w-6" />} 
              title="Team Members" 
              value={users.length.toString()} 
              subtitle="Active collaborators"
              color="bg-gradient-to-br from-blue-500 to-blue-700"
              loading={usersLoading}
              trend="up"
              trendValue="+3.2%"
              animationDelay={0.2}
            />
            <StatsCard 
              icon={<Layers className="h-6 w-6" />} 
              title="Active Projects" 
              value={activeProjects.toString()} 
              subtitle={`${completedProjects} completed`}
              color="bg-gradient-to-br from-green-500 to-green-700"
              loading={projectsLoading}
              trend="up"
              trendValue="+5.8%"
              animationDelay={0.3}
            />
            <StatsCard 
              icon={<Target className="h-6 w-6" />} 
              title="Productivity" 
              value={`${productivityScore}%`} 
              subtitle="Team efficiency"
              color="bg-gradient-to-br from-amber-500 to-amber-700"
              loading={loading}
              trend="up"
              trendValue="+7.2%"
              animationDelay={0.4}
            />
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="h-full backdrop-blur-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 rounded-full bg-pulse-500 mr-2"></div>
                      <p className="text-gray-300 text-sm font-medium">Task Completion Trend</p>
                    </div>
                    <h2 className="text-3xl font-bold text-white">{stats?.tasksCompleted ?? 0}</h2>
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-400/20 mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      24.8% increase
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    {timeRangeOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "text-xs font-medium",
                          timeRange === option.value
                            ? "bg-pulse-500/20 text-pulse-400 hover:bg-pulse-500/30"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                        onClick={() => setTimeRange(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={timeRange}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-64"
                  >
                    {loading ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Skeleton className="h-52 w-full" />
                      </div>
                    ) : (
                      <ChartContainer
                        config={{
                          tasks: {
                            label: "Completed Tasks",
                            theme: {
                              light: "#8b5cf6",
                              dark: "#8b5cf6"
                            }
                          },
                          progress: {
                            label: "Completion Rate",
                            theme: {
                              light: "#22c55e",
                              dark: "#22c55e"
                            }
                          }
                        }}
                      >
                        <AreaChart
                          data={sprintPerformanceData[timeRange]}
                          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                          <XAxis 
                            dataKey="name" 
                            stroke="#4B5563" 
                            tickLine={false}
                            axisLine={{ stroke: '#374151' }}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                          />
                          <YAxis 
                            stroke="#4B5563" 
                            tickLine={false}
                            axisLine={{ stroke: '#374151' }}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                          />
                          <ChartTooltip 
                            content={<ChartTooltipContent />} 
                            cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '5 5' }}
                          />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorTasks)"
                            name="tasks"
                            animationDuration={1500}
                          />
                          <Line
                            type="monotone"
                            dataKey="progress"
                            stroke="#22c55e"
                            strokeWidth={2}
                            dot={{ r: 4, fill: '#22c55e', stroke: '#22c55e', strokeWidth: 1 }}
                            activeDot={{ r: 6, stroke: '#0f172a', strokeWidth: 2 }}
                            name="progress"
                            animationDuration={1800}
                          />
                        </AreaChart>
                      </ChartContainer>
                    )}
                  </motion.div>
                </AnimatePresence>
              </GlassCard>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="h-full flex flex-col backdrop-blur-sm relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-pulse-500/10 rounded-full blur-xl"></div>
                <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
                <div className="mb-6 relative z-10">
                  <h3 className="text-xl font-medium text-white mb-1">Task Status</h3>
                  <p className="text-gray-400 text-sm">Distribution by Status</p>
                </div>
                
                <div className="flex-1 flex flex-col justify-center items-center relative z-10">
                  {tasks.length > 0 ? (
                    <div className="relative w-48 h-48 mb-3">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-4xl font-bold text-white">{completionRate}%</span>
                          <p className="text-xs text-gray-400">Completion rate</p>
                        </div>
                      </div>
                      
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={38}
                            outerRadius={45}
                            paddingAngle={2}
                            dataKey="value"
                            animationDuration={1000}
                            animationBegin={300}
                          >
                            {statusData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color} 
                                strokeWidth={0}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <AlertCircle className="h-12 w-12 text-gray-500 mb-2" />
                      <p className="text-gray-400">No tasks available</p>
                    </div>
                  )}
                  
                  <div className="w-full grid gap-2 mt-2">
                    {statusData.map((entry, index) => (
                      <motion.div 
                        key={entry.name} 
                        className="flex items-center justify-between text-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: entry.color }}
                          ></div>
                          <span className="text-gray-300">{entry.name}</span>
                        </div>
                        <span className="font-medium">{entry.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
          >
            <GlassCard className="h-full backdrop-blur-sm lg:col-span-1">
              <div className="mb-5">
                <h3 className="flex items-center text-xl font-medium text-white mb-1">
                  <Star className="h-5 w-5 mr-2 text-amber-400" />
                  Performance Metrics
                </h3>
                <p className="text-gray-400 text-sm">Overall team performance</p>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="20%" 
                    outerRadius="80%" 
                    barSize={10} 
                    data={radialData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar
                      background={{ fill: '#1e293b' }}
                      dataKey="value"
                      cornerRadius={10}
                      label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }}
                    />
                    <Legend 
                      iconSize={10} 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                      wrapperStyle={{ fontSize: '12px', color: '#d1d5db' }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Score']}
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151' }}
                      labelStyle={{ color: '#ffffff' }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
            
            <GlassCard className="h-full backdrop-blur-sm lg:col-span-2">
              <div className="mb-5">
                <h3 className="flex items-center text-xl font-medium text-white mb-1">
                  <Timer className="h-5 w-5 mr-2 text-blue-400" />
                  Recent Activity
                </h3>
                <p className="text-gray-400 text-sm">Latest updates from your team</p>
              </div>
              
              <div className="space-y-4">
                {loading ? (
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="space-y-5 relative">
                    <div className="absolute inset-y-0 left-4 w-px bg-gradient-to-b from-pulse-500/50 via-blue-500/50 to-transparent"></div>
                    
                    {activities.map((activity, index) => (
                      <ActivityItem 
                        key={index}
                        avatar={activity.avatar}
                        name={activity.name}
                        action={activity.action}
                        target={activity.target}
                        time={activity.time}
                        color={activity.color}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-6">
          <GlassCard>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-white">Project Overview</h3>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-400/20">
                {projects.length} Total Projects
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projectsLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-dark-400 rounded-lg p-4 border border-white/5">
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-full mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))
              ) : projects.slice(0, 4).map((project) => (
                <motion.div 
                  key={project.id} 
                  className="bg-dark-400 rounded-lg p-5 border border-white/5 hover:border-white/10 transition-all"
                  whileHover={{ translateY: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between mb-3">
                    <h4 className="font-medium text-lg">{project.name}</h4>
                    <Badge 
                      variant="outline" 
                      className={
                        project.status === "Completed" ? "bg-green-500/10 text-green-400 border-green-400/20" :
                        project.status === "In Progress" ? "bg-blue-500/10 text-blue-400 border-blue-400/20" :
                        project.status === "On Hold" ? "bg-orange-500/10 text-orange-400 border-orange-400/20" :
                        "bg-gray-500/10 text-gray-400 border-gray-400/20"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400 flex items-center">
                      <CalendarRange className="h-3 w-3 mr-1" />
                      {new Date(project.deadline).toLocaleDateString()}
                    </span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress 
                    value={project.progress} 
                    className="h-2"
                    indicatorClassName={
                      project.progress >= 80 ? "bg-green-500" : 
                      project.progress >= 40 ? "bg-blue-500" : 
                      "bg-orange-500"
                    }
                  />
                  
                  {project.team && project.team.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <div className="flex -space-x-2">
                        {project.team.slice(0, 3).map((member: any, idx: number) => (
                          <div 
                            key={idx} 
                            className="w-7 h-7 rounded-full bg-pulse-500/20 border-2 border-dark-400 flex items-center justify-center text-xs"
                          >
                            {member.name ? member.name.charAt(0) : 'U'}
                          </div>
                        ))}
                        {project.team.length > 3 && (
                          <div className="w-7 h-7 rounded-full bg-dark-300 border-2 border-dark-400 flex items-center justify-center text-xs text-gray-400">
                            +{project.team.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            {projects.length > 4 && (
              <div className="mt-4 text-center">
                <Button variant="outline" className="text-sm">
                  View All Projects
                </Button>
              </div>
            )}
          </GlassCard>
        </TabsContent>
        
        {isTeam && (
          <TabsContent value="tasks" className="space-y-6">
            <GlassCard>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium text-white">My Tasks</h3>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-400/20">
                  {myTasks.length} Total Tasks
                </Badge>
              </div>
              <div className="space-y-3">
                {tasksLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center p-3 bg-dark-400 rounded-lg border border-white/5">
                      <Skeleton className="h-4 w-4 mr-3" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-5 w-16" />
                    </div>
                  ))
                ) : myTasks.length > 0 ? myTasks.map((task) => (
                  <motion.div 
                    key={task.id} 
                    className="flex items-center p-4 bg-dark-400 rounded-lg border border-white/5 hover:border-white/10 transition-all"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex-shrink-0">
                      <input 
                        type="checkbox" 
                        className="h-5 w-5 rounded border-gray-600 text-pulse-600 focus:ring-pulse-600"
                        checked={task.status === 'completed'}
                        readOnly
                      />
                    </div>
                    <div className="flex-1 ml-4">
                      <h4 className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-white'}`}>
                        {task.title}
                      </h4>
                      <div className="flex items-center mt-1">
                        <span className="flex items-center text-xs text-gray-400 mr-3">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <Badge 
                        variant="outline" 
                        className={
                          task.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-400/20' :
                          task.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400 border-blue-400/20' :
                          task.status === 'review' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-400/20' :
                          'bg-gray-500/10 text-gray-400 border-gray-400/20'
                        }
                      >
                        {task.status === 'todo' ? 'To Do' : 
                        task.status === 'in-progress' ? 'In Progress' : 
                        task.status === 'review' ? 'In Review' : 
                        'Completed'}
                      </Badge>
                    </div>
                  </motion.div>
                )) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-dark-300 rounded-full flex items-center justify-center mb-4">
                      <CheckSquare className="h-8 w-8 text-gray-500" />
                    </div>
                    <p className="text-gray-400 mb-1">No tasks assigned to you yet</p>
                    <p className="text-xs text-gray-500">Tasks assigned to you will appear here</p>
                  </div>
                )}
              </div>
              {myTasks.length > 5 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" className="text-sm">
                    View All Tasks
                  </Button>
                </div>
              )}
            </GlassCard>
          </TabsContent>
        )}
        
        {isAdmin && (
          <TabsContent value="team" className="space-y-6">
            <GlassCard>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium text-white">Team Members</h3>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-400/20">
                  {users.length} Total Members
                </Badge>
              </div>
              <div className="space-y-4">
                {usersLoading ? (
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center p-3 bg-dark-400 rounded-lg border border-white/5">
                      <Skeleton className="w-10 h-10 rounded-full mr-3" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-5 w-16" />
                    </div>
                  ))
                ) : users.map((member) => (
                  <motion.div 
                    key={member.id} 
                    className="flex items-center p-4 bg-dark-400 rounded-lg border border-white/5 hover:border-white/10 transition-all"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pulse-400 to-pulse-600 flex items-center justify-center mr-3 text-white font-medium">
                      {member.name ? member.name.charAt(0) : 'U'}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white">{member.name}</h4>
                      <div className="flex items-center mt-0.5">
                        <p className="text-xs text-gray-400 mr-2">{member.email}</p>
                        <Badge 
                          variant="outline" 
                          className={
                            member.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-400/20' :
                            member.role === 'team' ? 'bg-blue-500/10 text-blue-400 border-blue-400/20' :
                            'bg-gray-500/10 text-gray-400 border-gray-400/20'
                          }
                        >
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-400/20 mr-2">
                        Online
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
