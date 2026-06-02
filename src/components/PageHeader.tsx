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
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  stats,
  className,
  children,
  action
}) => {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8", className)}>
      <div className="flex-1 min-w-0 flex flex-row items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-3xl font-black text-slate-50 tracking-tighter uppercase italic pr-2 flex items-center gap-2 sm:gap-3 min-w-0">
            <Icon className="text-indigo-500 w-5 h-5 sm:w-7 sm:h-7 shrink-0" />
            <span className="truncate pr-1">{title}</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1 font-medium">{description}</p>
          {children}
        </div>
        {action && (
          <div className="shrink-0 flex items-center justify-end">
            {action}
          </div>
        )}
      </div>
      
      {stats && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full md:w-auto md:w-max justify-start md:justify-end shrink-0">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex-1 sm:flex-none px-3 py-2 sm:px-4 sm:py-2 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center gap-2 sm:gap-3 min-w-0">
              <stat.icon className={cn(stat.color, "w-4 h-4 sm:w-6 sm:h-6 shrink-0")} />
              <div className="min-w-0">
                <p className="text-[8px] sm:text-xs font-bold text-slate-100 uppercase tracking-widest truncate">{stat.label}</p>
                <p className="text-base sm:text-xl font-black text-slate-400 leading-none truncate">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
