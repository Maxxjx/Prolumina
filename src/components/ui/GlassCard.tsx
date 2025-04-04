
import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  highlight?: boolean;
}

const GlassCard = ({ children, className, highlight, ...props }: GlassCardProps) => {
  return (
    <div
      className={cn(
        "backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg",
        highlight && "border-pulse-500/30 shadow-pulse-500/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
