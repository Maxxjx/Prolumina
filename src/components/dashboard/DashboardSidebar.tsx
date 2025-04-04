
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  ListChecks, 
  User, 
  Settings, 
  Shield, 
  HelpCircle, 
  Moon, 
  LogOut,
  Folder,
  ClipboardList,
  Users,
  FileBarChart,
  Menu,
  X,
  ChevronRight,
  Clock,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useActivityLogStore } from '@/stores/activityLogStore';
import ActivityLog from '@/components/dashboard/ActivityLog';

type NavItemProps = {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  to?: string;
  requiredRole?: 'admin' | 'team' | 'client';
  badge?: number | string;
};

const NavItem = ({ 
  icon: Icon, 
  label, 
  isActive, 
  onClick, 
  to, 
  requiredRole = 'client',
  badge
}: NavItemProps) => {
  const { hasRole } = useAuth();
  
  // Don't render if the user doesn't have the required role
  if (requiredRole && !hasRole(requiredRole)) {
    return null;
  }
  
  const content = (
    <div className="flex items-center w-full justify-between">
      <div className="flex items-center">
        <Icon className="mr-3 h-5 w-5" />
        <span className="text-sm font-medium transition-all duration-200">{label}</span>
      </div>
      {badge !== undefined && (
        <span className="ml-auto bg-pulse-600/20 text-white text-xs py-0.5 px-2 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );

  const className = cn(
    "flex items-center w-full px-4 py-3 text-left transition-all duration-200 rounded-lg group relative overflow-hidden",
    isActive 
      ? "bg-pulse-600/20 text-white before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-pulse-500" 
      : "text-gray-400 hover:bg-white/5 hover:text-white"
  );

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
};

export function DashboardSidebar() {
  const { logout, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showActivityDrawer, setShowActivityDrawer] = useState(false);
  const { getLatestLogs } = useActivityLogStore();
  
  const latestLogs = getLatestLogs(5);
  const unreadActivities = 3; // This would normally be calculated based on user's last viewed timestamp
  
  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setShowMobileMenu(prev => !prev);
  };
  
  // Activity drawer toggle
  const toggleActivityDrawer = () => {
    setShowActivityDrawer(prev => !prev);
  };

  // Sidebar toggle for desktop
  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  // Handle logout with confirmation
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      logout();
    }
  };

  // Mobile sidebar 
  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 h-16 bg-dark-400 border-b border-white/5 flex items-center justify-between px-4 z-40">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu} 
              className="mr-2"
              aria-label="Toggle menu"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-pulse-500 flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <h1 className="text-white text-xl font-bold">Prolumina</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleActivityDrawer}
              className="relative" 
              aria-label="Activity log"
            >
              <Clock size={20} />
              {unreadActivities > 0 && (
                <span className="absolute top-1 right-1 bg-pulse-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadActivities}
                </span>
              )}
            </Button>
            <Avatar className="h-8 w-8 border-2 border-pulse-500/30">
              <AvatarFallback className="bg-pulse-500/20 text-white">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
        
        {/* Mobile Menu */}
        <div 
          className={cn(
            "fixed inset-0 bg-dark-300/95 z-30 pt-16 transition-transform duration-300 ease-in-out transform",
            showMobileMenu ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <ScrollArea className="h-full px-2 py-4">
            <div className="space-y-1 mb-6">
              <NavItem 
                icon={LayoutDashboard} 
                label="Dashboard" 
                isActive={isActivePath('/dashboard')}
                to="/dashboard"
                requiredRole="client"
              />
              <NavItem 
                icon={Users} 
                label="User Management" 
                isActive={isActivePath('/admin')}
                to="/admin"
                requiredRole="admin"
              />
              <NavItem 
                icon={Folder} 
                label="Projects" 
                isActive={isActivePath('/projects')}
                to="/projects"
                requiredRole="client"
              />
              <NavItem 
                icon={ClipboardList} 
                label="All Tasks" 
                isActive={isActivePath('/tasks/all')}
                to="/tasks/all"
                requiredRole="team"
              />
              <NavItem 
                icon={ListChecks} 
                label="My Tasks" 
                isActive={isActivePath('/tasks')}
                to="/tasks"
                requiredRole="team"
                badge="5"
              />
              <NavItem 
                icon={BarChart3} 
                label="Statistics" 
                isActive={isActivePath('/statistics')}
                to="/statistics"
                requiredRole="client"
              />
              <NavItem 
                icon={FileBarChart} 
                label="Reports" 
                isActive={isActivePath('/reports')}
                to="/reports"
                requiredRole="client"
              />
              <NavItem 
                icon={User} 
                label="Profile" 
                isActive={isActivePath('/profile')}
                to="/profile"
                requiredRole="client"
              />
              <NavItem 
                icon={Settings} 
                label="Settings" 
                isActive={isActivePath('/settings')}
                to="/settings"
                requiredRole="client"
              />
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 space-y-1">
              <NavItem 
                icon={HelpCircle} 
                label="Help Centre" 
                isActive={false}
                onClick={() => window.open('https://help.example.com', '_blank')}
                requiredRole="client"
              />
              <NavItem 
                icon={Moon} 
                label="Dark Mode" 
                isActive={false}
                onClick={() => console.log('Toggle dark mode')}
                requiredRole="client"
              />
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/5">
              <button 
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-left text-gray-400 hover:text-white transition-colors rounded-md"
              >
                <LogOut className="mr-3 h-5 w-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </ScrollArea>
        </div>
        
        {/* Activity Drawer */}
        <div 
          className={cn(
            "fixed inset-0 bg-dark-300/95 z-30 pt-16 transition-transform duration-300 ease-in-out transform",
            showActivityDrawer ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex justify-between items-center px-4 py-3 border-b border-white/5">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleActivityDrawer}
            >
              <X size={20} />
            </Button>
          </div>
          <ActivityLog limit={10} maxHeight="calc(100vh - 80px)" className="border-0 rounded-none" />
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div 
      className={cn(
        "h-screen bg-dark-400 border-r border-white/5 flex flex-col transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className={cn("p-6", isCollapsed && "p-4")}>
        <div className={cn("flex items-center", isCollapsed && "justify-center")}>
          <div className="h-8 w-8 rounded-full bg-pulse-500 flex items-center justify-center mr-2">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          {!isCollapsed && <h1 className="text-white text-xl font-bold">Prolumina</h1>}
        </div>
      </div>
      
      <div className={cn("mt-2 px-4 py-2", isCollapsed && "px-2")}>
        <div className={cn(
          "flex items-center px-2 py-3", 
          isCollapsed && "justify-center px-0 flex-col"
        )}>
          <div className="w-8 h-8 rounded-full bg-pulse-500/30 flex items-center justify-center mr-2">
            <User className="h-4 w-4 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <div className="text-sm font-medium text-white">{user?.name || 'User'}</div>
              <div className="text-xs text-gray-400">{user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}</div>
            </div>
          )}
        </div>
      </div>
      
      <ScrollArea className={cn("px-3 py-2 flex-1", isCollapsed && "px-2")}>
        <div className="space-y-1">
          <NavItem 
            icon={LayoutDashboard} 
            label={isCollapsed ? "" : "Dashboard"} 
            isActive={isActivePath('/dashboard')}
            to="/dashboard"
            requiredRole="client"
          />
          <NavItem 
            icon={Users} 
            label={isCollapsed ? "" : "User Management"} 
            isActive={isActivePath('/admin')}
            to="/admin"
            requiredRole="admin"
          />
          <NavItem 
            icon={Folder} 
            label={isCollapsed ? "" : "Projects"} 
            isActive={isActivePath('/projects')}
            to="/projects"
            requiredRole="client"
          />
          <NavItem 
            icon={ClipboardList} 
            label={isCollapsed ? "" : "All Tasks"} 
            isActive={isActivePath('/tasks/all')}
            to="/tasks/all"
            requiredRole="team"
          />
          <NavItem 
            icon={ListChecks} 
            label={isCollapsed ? "" : "My Tasks"} 
            isActive={isActivePath('/tasks')}
            to="/tasks"
            requiredRole="team"
            badge={isCollapsed ? "5" : "5"}
          />
          <NavItem 
            icon={BarChart3} 
            label={isCollapsed ? "" : "Statistics"} 
            isActive={isActivePath('/statistics')}
            to="/statistics"
            requiredRole="client"
          />
          <NavItem 
            icon={FileBarChart} 
            label={isCollapsed ? "" : "Reports"} 
            isActive={isActivePath('/reports')}
            to="/reports"
            requiredRole="client"
          />
          <NavItem 
            icon={User} 
            label={isCollapsed ? "" : "Profile"} 
            isActive={isActivePath('/profile')}
            to="/profile"
            requiredRole="client"
          />
          <NavItem 
            icon={Settings} 
            label={isCollapsed ? "" : "Settings"} 
            isActive={isActivePath('/settings')}
            to="/settings"
            requiredRole="client"
          />
        </div>

        <div className={cn("mt-6 pt-6 border-t border-white/5 space-y-1", isCollapsed && "mt-4 pt-4")}>
          <NavItem 
            icon={HelpCircle} 
            label={isCollapsed ? "" : "Help Centre"} 
            isActive={false}
            onClick={() => window.open('https://help.example.com', '_blank')}
            requiredRole="client"
          />
          <NavItem 
            icon={Moon} 
            label={isCollapsed ? "" : "Dark Mode"} 
            isActive={false}
            onClick={() => console.log('Toggle dark mode')}
            requiredRole="client"
          />
        </div>
      </ScrollArea>

      <div className={cn("p-4 border-t border-white/5 flex", isCollapsed && "justify-center")}>
        <button 
          onClick={toggleSidebar}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
        
        {!isCollapsed && (
          <button 
            onClick={handleLogout}
            className="flex items-center ml-auto text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="mr-2 h-5 w-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        )}
      </div>
    </div>
  );
}
