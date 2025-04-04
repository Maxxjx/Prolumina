
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, AreaChart, Legend, Tooltip as RechartsTooltip, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar, Line, Pie, Area } from "recharts";
import { useAuth } from "@/hooks/useAuth";
import GlassCard from "@/components/ui/GlassCard";

const data = [
  { name: "Jan", completed: 45, pending: 28, total: 73 },
  { name: "Feb", completed: 52, pending: 23, total: 75 },
  { name: "Mar", completed: 48, pending: 30, total: 78 },
  { name: "Apr", completed: 61, pending: 27, total: 88 },
  { name: "May", completed: 55, pending: 18, total: 73 },
  { name: "Jun", completed: 67, pending: 20, total: 87 },
];

const pieData = [
  { name: "Development", value: 45, fill: "#8b5cf6" },
  { name: "Design", value: 25, fill: "#3b82f6" },
  { name: "Marketing", value: 15, fill: "#10b981" },
  { name: "Research", value: 15, fill: "#f97316" },
];

const chartData = [
  { name: 'Jan', completed: 12, pending: 5 },
  { name: 'Feb', completed: 19, pending: 7 },
  { name: 'Mar', completed: 15, pending: 8 },
  { name: 'Apr', completed: 25, pending: 10 },
  { name: 'May', completed: 32, pending: 12 },
  { name: 'Jun', completed: 28, pending: 6 },
];

export default function Statistics() {
  const { isAdmin } = useAuth();

  return (
    <DashboardLayout title="Statistics">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="bg-dark-400 border-none shadow-lg">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Task Completion Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <RechartsTooltip contentStyle={{ backgroundColor: "#1F2937", border: "none" }} />
                  <Legend />
                  <Line type="monotone" dataKey="completed" stroke="#8b5cf6" strokeWidth={2} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="pending" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
        
        <Card className="bg-dark-400 border-none shadow-lg">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Task Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  />
                  <RechartsTooltip contentStyle={{ backgroundColor: "#1F2937", border: "none" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>

      {/* Project Progress Graph (moved from Dashboard) */}
      <Card className="bg-dark-400 border-none shadow-lg mb-8">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Project Progress</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend />
                <Bar dataKey="completed" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Completed Tasks" />
                <Bar dataKey="pending" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Pending Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      <Card className="bg-dark-400 border-none shadow-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Monthly Task Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <RechartsTooltip contentStyle={{ backgroundColor: "#1F2937", border: "none" }} />
                <Legend />
                <Bar dataKey="completed" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Admin Analytics (moved from Dashboard) */}
      {isAdmin && (
        <div className="mt-6">
          <Card className="bg-dark-400 border-none shadow-lg">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Admin Analytics</h3>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { name: 'Week 1', users: 10, projects: 5 },
                      { name: 'Week 2', users: 15, projects: 8 },
                      { name: 'Week 3', users: 22, projects: 12 },
                      { name: 'Week 4', users: 28, projects: 15 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} name="New Users" />
                    <Line type="monotone" dataKey="projects" stroke="#f59e0b" strokeWidth={2} name="New Projects" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
