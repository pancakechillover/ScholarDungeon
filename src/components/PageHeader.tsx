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
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
          <Icon className="text-indigo-500" size={32} />
          {title}
        </h2>
        <p className="text-slate-500 text-sm mt-1 font-medium">{description}</p>
        {children}
      </div>
      
      {stats && (
        <div className="flex gap-4 w-full md:w-auto justify-between md:justify-start">
          {stats.map((stat, idx) => (
            <div key={idx} className="px-4 py-2 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center gap-3">
              <stat.icon className={cn(stat.color, "w-[18px] h-[18px] md:w-6 md:h-6")} />
              <div>
                <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                <p className="text-lg md:text-xl font-black text-white leading-none">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
