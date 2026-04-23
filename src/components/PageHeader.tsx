import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface Stat {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

interface PageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  stats?: Stat[];
  className?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  stats,
  className,
  children 
}) => {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8", className)}>
      <div className="flex-1">
        <h2 className="text-xl sm:text-3xl font-black text-white tracking-tighter uppercase italic pr-2 flex items-center gap-2 sm:gap-3">
          <Icon className="text-indigo-500 w-5 h-5 sm:w-7 sm:h-7" />
          {title}
        </h2>
        <p className="text-slate-500 text-sm mt-1 font-medium">{description}</p>
        {children}
      </div>
      
      {stats && (
        <div className="flex flex-wrap gap-2 sm:gap-4 w-full md:w-auto justify-start">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex-1 sm:flex-none px-3 py-2 sm:px-4 sm:py-2 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center gap-2 sm:gap-3 min-w-0">
              <stat.icon className={cn(stat.color, "w-4 h-4 sm:w-6 sm:h-6 shrink-0")} />
              <div className="min-w-0">
                <p className="text-[8px] sm:text-xs font-bold text-white uppercase tracking-widest truncate">{stat.label}</p>
                <p className="text-base sm:text-xl font-black text-slate-500 leading-none truncate">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
