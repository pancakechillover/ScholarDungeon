import React, { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { createPortal } from 'react-dom';

interface TimePickerProps {
  value: string; // HH:mm
  onChange: (time: string) => void;
  className?: string;
  disabled?: boolean;
}

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, className, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);
  
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');

  useEffect(() => {
    if (value && value.includes(':')) {
      const parts = value.split(':');
      setHours(parts[0].padStart(2, '0'));
      setMinutes(parts[1].padStart(2, '0'));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
       if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        popoverRef.current && !popoverRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const updatePosition = () => {
    if (triggerRef.current && isOpen) {
        const rect = triggerRef.current.getBoundingClientRect();
        
        let top = rect.bottom + window.scrollY + 8;
        let left = rect.left + window.scrollX;
        
        // Prevent going off right edge
        if (left + 200 > window.innerWidth) {
            left = window.innerWidth - 200 - 16;
        }
        
        // Prevent going off left edge
        if (left < 16) {
            left = 16;
        }

        // Prevent going off bottom edge
        if (top + 280 > window.innerHeight + window.scrollY) {
            top = rect.top + window.scrollY - 280 - 8;
        }
        
        // Prevent going off top edge
        if (top < 16) {
            top = 16;
        }

        setPopoverStyle({
            top: `${top}px`,
            left: `${left}px`,
        });
    }
  };

  useEffect(() => {
    updatePosition();
    if (isOpen) {
        window.addEventListener('resize', updatePosition, { passive: true });
        window.addEventListener('scroll', updatePosition, true);
        
        // Scroll to current selected values
        setTimeout(() => {
          const activeH = hourRef.current?.querySelector('.active-h') as HTMLElement;
          if (activeH && hourRef.current) {
             hourRef.current.scrollTop = activeH.offsetTop - hourRef.current.clientHeight / 2 + activeH.clientHeight / 2;
          }
          const activeM = minRef.current?.querySelector('.active-m') as HTMLElement;
          if (activeM && minRef.current) {
             minRef.current.scrollTop = activeM.offsetTop - minRef.current.clientHeight / 2 + activeM.clientHeight / 2;
          }
        }, 10);
    }
    return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
    }
  }, [isOpen]);

  const commitChange = (h: string, m: string) => {
     onChange(`${h}:${m}`);
  };

  const selectHour = (h: string) => {
    setHours(h);
    commitChange(h, minutes);
  };

  const selectMinute = (m: string) => {
    setMinutes(m);
    commitChange(hours, m);
  };

  const ALL_HOURS = Array.from({length: 24}, (_, i) => String(i).padStart(2, '0'));
  const ALL_MINS = Array.from({length: 60}, (_, i) => String(i).padStart(2, '0'));

  return (
    <>
      <div 
        ref={triggerRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 transition-colors",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-indigo-500",
          className
        )}
      >
        <span>{value || '00:00'}</span>
        <Clock size={16} className="text-slate-400" />
      </div>

      {isOpen && !disabled && createPortal(
        <div 
          ref={popoverRef}
          style={popoverStyle}
          className="absolute z-[9999] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-[200px] h-[260px] animate-in fade-in zoom-in-95 duration-200 flex flex-col overflow-hidden"
        >
           <div className="flex bg-slate-950 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <div className="flex-1 text-center py-2">HH</div>
              <div className="flex-1 text-center py-2 border-l border-slate-800">MM</div>
           </div>
           
           <div className="flex flex-1 overflow-hidden relative">
              {/* Highlight bar in the center */}
              <div className="absolute top-1/2 left-0 right-0 h-10 -mt-5 bg-indigo-500/10 border-y border-indigo-500/30 pointer-events-none" />
              
              <div ref={hourRef} className="flex-1 overflow-y-auto no-scrollbar py-[100px] snap-y snap-mandatory scroll-smooth">
                 {ALL_HOURS.map(h => (
                   <div 
                     key={h}
                     onClick={(e) => {
                        e.stopPropagation();
                        selectHour(h);
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                           parent.scrollTo({ top: e.currentTarget.offsetTop - parent.clientHeight/2 + e.currentTarget.clientHeight/2, behavior: 'smooth' });
                        }
                     }}
                     className={cn(
                       "h-10 flex items-center justify-center cursor-pointer snap-center text-lg transition-colors font-medium",
                       h === hours ? "active-h text-indigo-400 font-bold" : "text-slate-400 hover:text-slate-200"
                     )}
                   >
                     {h}
                   </div>
                 ))}
              </div>
              <div className="w-px bg-slate-800" />
              <div ref={minRef} className="flex-1 overflow-y-auto no-scrollbar py-[100px] snap-y snap-mandatory scroll-smooth">
                 {ALL_MINS.map(m => (
                   <div 
                     key={m}
                     onClick={(e) => {
                        e.stopPropagation();
                        selectMinute(m);
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                           parent.scrollTo({ top: e.currentTarget.offsetTop - parent.clientHeight/2 + e.currentTarget.clientHeight/2, behavior: 'smooth' });
                        }
                     }}
                     className={cn(
                       "h-10 flex items-center justify-center cursor-pointer snap-center text-lg transition-colors font-medium",
                       m === minutes ? "active-m text-indigo-400 font-bold" : "text-slate-400 hover:text-slate-200"
                     )}
                   >
                     {m}
                   </div>
                 ))}
              </div>
           </div>
        </div>,
        document.body
      )}
    </>
  );
}
