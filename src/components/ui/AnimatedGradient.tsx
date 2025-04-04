
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedGradientProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  gradientClassName?: string;
}

const AnimatedGradient = ({ 
  children, 
  className, 
  gradientClassName,
  ...props 
}: AnimatedGradientProps) => {
  return (
    <div className={cn("relative isolate overflow-hidden", className)} {...props}>
      <div 
        className={cn(
          "absolute inset-0 -z-10 opacity-30 blur-3xl",
          "bg-gradient-to-br from-pulse-500/30 via-pulse-600/20 to-pulse-700/30",
          "animate-gradient-shift bg-[size:200%_200%]",
          gradientClassName
        )}
        aria-hidden="true"
      />
      {children}
    </div>
  );
};

export default AnimatedGradient;
