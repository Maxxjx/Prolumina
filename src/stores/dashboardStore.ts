import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { format, subMonths } from 'date-fns';

interface DashboardStats {
  activeProjects: number;
  totalUsers: number;
  hoursLogged: number;
  tasksCompleted: number;
  sprintProgress: number;
  projectVelocity: {
    current: number;
    previous: number;
    change: number;
  };
}

interface ProjectOverview {
  id: string;
  name: string;
  deadline: string;
  teamCount: number;
  budget: string;
  progress: number;
  status: string;
}

interface SprintPerformanceData {
  name: string;
  value: number;
}

interface TimeRangeData {
  "1D": SprintPerformanceData[];
  "1W": SprintPerformanceData[];
  "1M": SprintPerformanceData[];
  "3M": SprintPerformanceData[];
  "1Y": SprintPerformanceData[];
}

interface DashboardStore {
  stats: DashboardStats | null;
  projectOverviews: ProjectOverview[];
  sprintPerformanceData: TimeRangeData;
  loading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  stats: null,
  projectOverviews: [],
  sprintPerformanceData: {
    "1D": [],
    "1W": [],
    "1M": [],
    "3M": [],
    "1Y": []
  },
  loading: false,
  error: null,
  
  fetchDashboardData: async () => {
    set({ loading: true, error: null });
    try {
      // Fetch active projects count
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, name, status, deadline, progress');
      
      if (projectsError) throw projectsError;
      
      const activeProjects = projectsData.filter(p => p.status !== 'Completed').length;
      
      // Fetch team members count
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, role');
      
      if (usersError) throw usersError;
      
      const totalUsers = usersData.length;
      
      // Fetch completed tasks count
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('id, status, due_date');
      
      if (tasksError) throw tasksError;
      
      const tasksCompleted = tasksData.filter(t => t.status === 'completed').length;
      
      // Generate project overviews
      const projectOverviews: ProjectOverview[] = await Promise.all(
        projectsData.slice(0, 3).map(async (project) => {
          // Get team members for this project
          const { data: teamData, error: teamError } = await supabase
            .from('project_members')
            .select('user_id')
            .eq('project_id', project.id);
          
          if (teamError) throw teamError;
          
          const teamCount = teamData.length;
          
          // Generate a placeholder budget based on team size
          const budget = `$${(teamCount * 7000 + 10000).toLocaleString()}`;
          
          return {
            id: project.id,
            name: project.name,
            deadline: format(new Date(project.deadline), 'MMM d, yyyy'),
            teamCount,
            budget,
            progress: project.progress,
            status: project.progress > 80 ? 'On Track' : project.progress > 40 ? 'On Track' : 'At Risk'
          };
        })
      );
      
      // Historical performance data simulation based on tasks
      // For real implementation, you would need a table to store historical performance metrics
      const today = new Date();
      
      // Generate data for each time range based on tasks data
      // This is a simplified approach; in a real app, you would have actual historical data
      
      // Generate daily data (last 24 hours)
      const dailyData = [9, 12, 15, 18].map(hour => {
        const todayWithHour = new Date(today);
        todayWithHour.setHours(hour, 0, 0, 0);
        const hourFormatted = format(todayWithHour, 'h a');
        
        // Use task completion data as a proxy for performance, or a random value if no real data
        const tasksCompletedThisHour = tasksData.filter(
          t => t.status === 'completed' && 
          new Date(t.due_date).getHours() === hour
        ).length;
        
        return {
          name: hourFormatted,
          value: tasksCompletedThisHour || Math.floor(Math.random() * 40) + 10
        };
      });
      
      // Generate weekly data (last 7 days)
      const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const weeklyData = daysOfWeek.map((day, idx) => {
        return {
          name: day,
          // Use some tasks data plus randomization
          value: Math.min(tasksCompleted / 7 * (idx + 1) + Math.random() * 20, 80)
        };
      });
      
      // Generate monthly data (last 4 weeks)
      const monthlyData = Array.from({ length: 4 }).map((_, idx) => {
        return {
          name: `Week ${idx + 1}`,
          value: Math.min(tasksCompleted / 4 * (idx + 1) + Math.random() * 15, 70)
        };
      });
      
      // Generate quarterly data (last 3 months)
      const quarterlyData = Array.from({ length: 6 }).map((_, idx) => {
        const date = subMonths(today, 2).setDate(15 * (idx + 1) / 2);
        return {
          name: format(date, 'MMM d'),
          value: Math.min(20 + idx * 15 + Math.random() * 10, 90)
        };
      });
      
      // Generate yearly data (last 12 months)
      const months = ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'];
      const yearlyData = months.map((month, idx) => {
        return {
          name: month,
          value: Math.min(30 + idx * 14 + Math.random() * 10, 100)
        };
      });
      
      // Hours logged calculation based on the number of completed tasks (simplified estimation)
      const hoursLogged = Math.floor(tasksCompleted * 2.5);
      
      // Calculate sprint progress as an overall percentage of task completion
      const sprintProgress = tasksData.length > 0 
        ? Math.round((tasksCompleted / tasksData.length) * 100) 
        : 0;
      
      // Calculate project velocity
      const currentVelocity = 84; // Points in current sprint
      const previousVelocity = 77; // Points in previous sprint
      const velocityChange = currentVelocity - previousVelocity;
      const velocityChangePercent = previousVelocity > 0 
        ? Math.round((velocityChange / previousVelocity) * 100 * 10) / 10
        : 0;
      
      set({
        stats: {
          activeProjects,
          totalUsers,
          hoursLogged,
          tasksCompleted,
          sprintProgress,
          projectVelocity: {
            current: currentVelocity,
            previous: previousVelocity,
            change: velocityChangePercent
          }
        },
        projectOverviews,
        sprintPerformanceData: {
          "1D": dailyData,
          "1W": weeklyData,
          "1M": monthlyData,
          "3M": quarterlyData,
          "1Y": yearlyData
        },
        loading: false
      });
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      set({ 
        error: error.message || 'Failed to fetch dashboard data', 
        loading: false 
      });
    }
  }
})); 