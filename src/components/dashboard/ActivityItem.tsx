import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ActivityItemProps {
  avatar: string;
  name: string;
  action: string;
  target: string;
  time: string;
  color: string;
  className?: string;
  index?: number;
}

export default function ActivityItem({ 
  avatar, 
  name, 
  action, 
  target, 
  time, 
  color,
  className,
  index = 0
}: ActivityItemProps) {
  return (
    <motion.div 
      className={cn(
        "flex items-start relative pl-9",
        className
      )}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut"
      }}
    >
      {/* Timeline connector line */}
      {index > 0 && (
        <div className="absolute left-4 top-0 -translate-x-1/2 h-full w-px bg-white/10"></div>
      )}
      
      {/* Avatar */}
      <Avatar className={cn(
        "absolute left-0 w-8 h-8 flex items-center justify-center text-white font-medium text-sm",
        color
      )}>
        <AvatarFallback>{avatar}</AvatarFallback>
      </Avatar>
      
      {/* Content */}
      <div className="ml-4 pt-0.5">
        <p className="text-sm leading-tight">
          <motion.span 
            className="font-medium text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: (index * 0.1) + 0.2 }}
          >
            {name}
          </motion.span>
          <motion.span 
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: (index * 0.1) + 0.3 }}
          >
            {' '}{action}{' '}
          </motion.span>
          <motion.span 
            className="font-medium text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: (index * 0.1) + 0.4 }}
          >
            {target}
          </motion.span>
        </p>
        
        <motion.p 
          className="text-xs text-gray-500 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: (index * 0.1) + 0.5 }}
        >
          {time}
        </motion.p>
      </div>
      
      {/* Timeline dot */}
      <motion.div 
        className={cn(
          "absolute left-4 top-4 w-2 h-2 rounded-full z-10 -translate-x-1/2 -translate-y-1/2",
          color.replace('bg-', 'bg-')
        )}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 15, 
          delay: (index * 0.1) + 0.1
        }}
      />
    </motion.div>
  );
} 