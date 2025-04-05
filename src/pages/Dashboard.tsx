import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Users, Clock, CheckCircle2, Briefcase, Target, Kanban, CalendarCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useDashboardStore } from "@/stores/dashboardStore";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { isAdmin, isTeam, user } = useAuth();
  const [timeRange, setTimeRange] = useState("3M");
  const [watchlistTab, setWatchlistTab] = useState("mostViewed");

  const { 
    stats, 
    projectOverviews, 
    sprintPerformanceData, 
    loading, 
    error, 
    fetchDashboardData 
  } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const statsConfig = [
    { 
      title: "Active Projects", 
      value: stats?.activeProjects.toString() ?? "0", 
      change: "+2.5%", 
      icon: Briefcase, 
      color: "bg-blue-500" 
    },
    { 
      title: "Team Members", 
      value: stats?.totalUsers.toString() ?? "0", 
      change: "+3.2%", 
      icon: Users, 
      color: "bg-green-500" 
    },
    { 
      title: "Hours Logged", 
      value: stats?.hoursLogged.toString() ?? "0", 
      change: "+12.4%", 
      icon: Clock, 
      color: "bg-purple-500" 
    },
    { 
      title: "Tasks Completed", 
      value: stats?.tasksCompleted.toString() ?? "0", 
      change: "+8.1%", 
      icon: CheckCircle2, 
      color: "bg-orange-500" 
    },
    { 
      title: "Sprint Goals", 
      value: `${stats?.sprintProgress ?? 0}%`, 
      change: "+5.1%", 
      icon: Target, 
      color: "bg-cyan-500" 
    },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-gray-400">
              {isAdmin ? 'Project Admin - You have full access to all features' : 
              isTeam ? 'Project Manager - You can manage tasks and team members' : 
              'Team Member - View your assigned tasks and project statistics'}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="bg-dark-400 rounded-lg p-3">
              <div className="flex items-center">
                <span className="text-white font-medium mr-2">Project Velocity</span>
                <span className={stats?.projectVelocity.change > 0 ? "text-green-400 text-sm" : "text-red-400 text-sm"}>
                  {stats?.projectVelocity.change > 0 ? '+' : ''}{stats?.projectVelocity.change}%
                </span>
              </div>
              <div className="text-2xl font-bold mt-1">{stats?.projectVelocity.current ?? 0} points</div>
              <div className="text-gray-400 text-xs mt-1">
                Previous sprint: <span className={stats?.projectVelocity.change > 0 ? "text-green-400" : "text-red-400"}>
                  {stats?.projectVelocity.change > 0 ? '+' : ''}{stats?.projectVelocity.current - (stats?.projectVelocity.previous ?? 0)} points
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
          {statsConfig.map((stat, index) => (
            <Card key={index} className="bg-dark-400 border-none shadow-lg">
              <div className="p-3">
                <div className="flex items-center mb-1">
                  <div className={`p-1.5 rounded-md ${stat.color} mr-2`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-400 text-xs">{stat.title}</span>
                </div>
                <div className="flex justify-between items-end">
                  {loading ? (
                    <Skeleton className="h-6 w-12" />
                  ) : (
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  )}
                  <span className="text-green-400 text-xs">{stat.change}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mb-6">
          <GlassCard className="h-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Sprint Performance</h2>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-white mr-2">{stats?.projectVelocity.current ?? 0} points</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-green-400/20 text-green-400">+24.8%</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Tabs defaultValue={timeRange} onValueChange={setTimeRange}>
                  <TabsList className="bg-dark-400 border-white/10">
                    <TabsTrigger value="1D" className="text-xs">1D</TabsTrigger>
                    <TabsTrigger value="1W" className="text-xs">1W</TabsTrigger>
                    <TabsTrigger value="1M" className="text-xs">1M</TabsTrigger>
                    <TabsTrigger value="3M" className="text-xs">3M</TabsTrigger>
                    <TabsTrigger value="1Y" className="text-xs">1Y</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            <div className="h-64">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Skeleton className="h-52 w-full" />
                </div>
              ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={sprintPerformanceData[timeRange as keyof typeof sprintPerformanceData]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                  <XAxis dataKey="name" stroke="#4B5563" />
                  <YAxis stroke="#4B5563" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '0.5rem' }}
                    labelStyle={{ color: '#F9FAFB' }}
                    itemStyle={{ color: '#8b5cf6' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
              )}
            </div>
          </GlassCard>
        </div>

        <div className="mb-6">
          <Card className="bg-dark-400 border-none shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">Project Overview</h3>
                <div className="flex space-x-2">
                  <button className="bg-pulse-600/20 text-pulse-400 px-3 py-1 rounded-md text-xs hover:bg-pulse-600/30 transition-colors">
                    All
                  </button>
                  <button className="bg-dark-300 text-gray-400 px-3 py-1 rounded-md text-xs hover:bg-dark-200 transition-colors">
                    Active
                  </button>
                  <button className="bg-dark-300 text-gray-400 px-3 py-1 rounded-md text-xs hover:bg-dark-200 transition-colors">
                    Upcoming
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-gray-400 text-xs border-b border-white/5">
                      <th className="text-left pb-2">Project Name</th>
                      <th className="text-left pb-2">Deadline</th>
                      <th className="text-left pb-2">Team</th>
                      <th className="text-left pb-2">Budget</th>
                      <th className="text-left pb-2">Progress</th>
                      <th className="text-left pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <tr key={index} className="border-b border-white/5">
                          <td className="py-3"><Skeleton className="h-6 w-40" /></td>
                          <td className="py-3"><Skeleton className="h-6 w-24" /></td>
                          <td className="py-3"><Skeleton className="h-6 w-20" /></td>
                          <td className="py-3"><Skeleton className="h-6 w-20" /></td>
                          <td className="py-3"><Skeleton className="h-6 w-full" /></td>
                          <td className="py-3"><Skeleton className="h-6 w-20" /></td>
                        </tr>
                      ))
                    ) : (
                      projectOverviews.map((project, index) => (
                      <tr key={index} className="border-b border-white/5 text-sm">
                        <td className="py-3 flex items-center">
                          <div className="w-8 h-8 rounded-full bg-pulse-500/20 flex items-center justify-center mr-2">
                              <span className="text-pulse-500">{project.name.charAt(0)}</span>
                          </div>
                            {project.name}
                        </td>
                          <td className="py-3">{project.deadline}</td>
                          <td className="py-3">{project.teamCount} members</td>
                          <td className="py-3">{project.budget}</td>
                        <td className="py-3">
                          <div className="w-full bg-dark-300 h-2 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full",
                                  project.status === "On Track" ? "bg-green-500" : 
                                  project.status === "At Risk" ? "bg-orange-500" : 
                                  "bg-red-500"
                              )}
                                style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </td>
                          <td className="py-3">
                            <span 
                              className={cn(
                                "text-xs px-2 py-1 rounded",
                                project.status === "On Track" ? "bg-green-500/20 text-green-400" : 
                                project.status === "At Risk" ? "bg-orange-500/20 text-orange-400" : 
                                "bg-red-500/20 text-red-400"
                              )}
                            >
                              {project.status}
                            </span>
                        </td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <DashboardTabs />
      </div>
    </DashboardLayout>
  );
}
