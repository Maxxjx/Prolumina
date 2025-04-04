
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
    className={cn("flex flex-col items-start", 
      `animate-slide-up animate-delay-${delay}`, 
      className
    )}
  >
    <div className="mb-5 p-3 rounded-lg bg-pulse-500/10 text-pulse-400">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
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
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-dark-200 text-pulse-400 border border-white/5 mb-4 animate-fade-in">
            <span className="text-xs font-medium">Powerful Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-slide-down">
            Everything You Need to Manage Projects
          </h2>
          <p className="text-gray-400 animate-slide-down animate-delay-100">
            ProjectPulse combines powerful features with an intuitive interface to help your team deliver projects on time and within budget.
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

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pulse-500/5 rounded-full blur-3xl -z-10"></div>
    </section>
  );
};

export default Features;
