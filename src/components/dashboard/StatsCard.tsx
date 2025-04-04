import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
  loading?: boolean;
  trend?: 'up' | 'down' | null;
  trendValue?: string;
  subtitle?: string;
  className?: string;
  animationDelay?: number;
}

export default function StatsCard({ 
  icon, 
  title, 
  value, 
  color, 
  loading = false, 
  trend, 
  trendValue, 
  subtitle,
  className,
  animationDelay = 0
}: StatsCardProps) {
  return (
    <motion.div 
      className={cn(
        "bg-dark-200/60 backdrop-blur-sm border border-white/5 rounded-lg p-5 flex flex-col hover:border-white/10 transition-all overflow-hidden relative group shadow-sm",
        className
      )}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: animationDelay, 
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ 
        translateY: -5, 
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        transition: { duration: 0.2 }
      }}
    >
      {/* Background effects */}
      <div 
        className={cn(
          "absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-20 blur-xl transition-all duration-500 group-hover:scale-125",
          color.includes('gradient') ? color : color.replace('bg-', 'bg-') 
        )}
      />
      
      <div className="absolute right-0 top-0 w-24 h-24 opacity-10 transform transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
        {icon}
      </div>
      
      <div className="flex items-center mb-3 relative z-10">
        <motion.div 
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center mr-3 shadow-lg",
            color
          )}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {icon}
        </motion.div>
        <div className="flex-1">
          <p className="text-gray-300 text-sm font-medium">{title}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-0.5">{subtitle}</p>}
        </div>
      </div>
      
      <div className="flex items-end justify-between relative z-10">
        {loading ? (
          <Skeleton className="h-10 w-24" />
        ) : (
          <motion.p 
            className="text-white text-3xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: animationDelay + 0.1,
              ease: "easeOut" 
            }}
          >
            {value}
          </motion.p>
        )}
        
        {trend && (
          <motion.div 
            className={cn(
              "flex items-center text-xs px-2 py-1 rounded-full",
              trend === 'up' 
                ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.3, 
              delay: animationDelay + 0.2,
              ease: "easeOut"
            }}
          >
            <ArrowUpRight 
              className={cn(
                "h-3 w-3 mr-1", 
                trend === 'down' && "transform rotate-90"
              )} 
            />
            {trendValue}
          </motion.div>
        )}
      </div>
      
      {/* Bottom gradient border effect */}
      <motion.div 
        className={cn(
          "absolute left-0 right-0 bottom-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          color.includes('gradient') ? color : color.replace('bg-', 'bg-')
        )}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
} 