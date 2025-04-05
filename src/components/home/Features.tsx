import React from 'react';
import { cn } from "@/lib/utils";
import GlassCard from '@/components/ui/GlassCard';
import { Users, BarChart3, Layout, Clock, Shuffle, Zap, Globe, Lock } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, className, delay }: FeatureCardProps) => (
  <GlassCard 
    className={cn(
      "flex flex-col items-start transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg hover:shadow-purple-500/10 group", 
      `animate-slide-up animate-delay-${delay} animate-on-scroll`, 
      className
    )}
  >
    <div className="mb-5 p-3 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 group-hover:scale-110 transform transition-all duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">{title}</h3>
    <p className="text-gray-400 text-sm">{description}</p>
  </GlassCard>
);

const Features = () => {
  const features = [
    {
      icon: <Users size={24} />,
      title: "Multi-Role Access",
      description: "Tailored dashboards for administrators, team members, and clients with role-specific controls."
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Real-Time Analytics",
      description: "Interactive charts and visualizations providing instant insights into project performance."
    },
    {
      icon: <Layout size={24} />,
      title: "Task Management",
      description: "Drag-and-drop Kanban boards for intuitive task organization and progress tracking."
    },
    {
      icon: <Clock size={24} />,
      title: "Time Tracking",
      description: "Built-in time tracking for tasks with automated reporting and analytics."
    },
    {
      icon: <Shuffle size={24} />,
      title: "Workflow Automation",
      description: "Create custom automations to streamline repetitive processes and save time."
    },
    {
      icon: <Zap size={24} />,
      title: "High Performance",
      description: "Blazing fast response times and seamless user experience across all devices."
    },
    {
      icon: <Globe size={24} />,
      title: "Collaboration Tools",
      description: "Real-time commenting, file sharing, and team communication tools built-in."
    },
    {
      icon: <Lock size={24} />,
      title: "Advanced Security",
      description: "Enterprise-grade security with role-based permissions and data encryption."
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden" id="features">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-dark-200 text-purple-400 border border-purple-500/10 mb-4 animate-fade-in hover:bg-dark-100 transition-all cursor-pointer">
            <span className="text-xs font-medium">Powerful Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-slide-down">
            <span className="bg-gradient-to-r from-purple-100 to-purple-300 bg-clip-text text-transparent">Everything You Need</span> to Manage Projects
          </h2>
          <p className="text-gray-400 animate-slide-down animate-delay-100">
            Prolumina combines powerful features with an intuitive interface to help your team deliver projects on time and within budget.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={(index % 4) * 100}
            />
          ))}
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      
      {/* Animated dots pattern */}
      <div className="absolute inset-0 -z-5 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>
    </section>
  );
};

export default Features;
