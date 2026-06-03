import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { StudySession, Dungeon, MajorDungeon } from '../types';
import { format, parseISO, isSameDay, getDay } from 'date-fns';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#3b82f6'];

interface Props {
  weekSessions: StudySession[];
  mode: 'time_of_day' | 'day_of_week';
}

export const WeeklyPieChart: React.FC<Props> = ({ weekSessions, mode }) => {
  const chartData = useMemo(() => {
    if (mode === 'day_of_week') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const grouped: Record<string, number> = {};
      weekSessions.forEach(s => {
        const d = new Date(s.timestamp);
        const dayName = days[getDay(d)];
        grouped[dayName] = (grouped[dayName] || 0) + (s.duration || 0);
      });
      // Ensure day order
      return days.map(d => ({ name: d, value: grouped[d] || 0 })).filter(d => d.value > 0);
    } else {
      // Time of day (Morning/Afternoon/Night)
      // Usually determined by the `period` field or the actual hour
      const grouped = {
        'Morning': 0,
        'Afternoon': 0,
        'Night': 0
      };
      weekSessions.forEach(s => {
        if (s.period) {
          const p = s.period.toLowerCase();
          if (p.includes('morning')) grouped.Morning += (s.duration || 0);
          else if (p.includes('afternoon')) grouped.Afternoon += (s.duration || 0);
          else if (p.includes('night')) grouped.Night += (s.duration || 0);
          else grouped.Morning += (s.duration || 0); 
        } else {
          // Fallback based on hour if missing
          const h = new Date(s.timestamp).getHours();
          if (h >= 5 && h < 12) grouped.Morning += (s.duration || 0);
          else if (h >= 12 && h < 18) grouped.Afternoon += (s.duration || 0);
          else grouped.Night += (s.duration || 0);
        }
      });
      return Object.entries(grouped).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);
    }
  }, [weekSessions, mode]);

  if (!chartData.length || chartData.reduce((a, b) => a + b.value, 0) === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 font-bold italic">
        No records this week
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(val: number) => {
              const h = Math.floor(val / 60);
              const m = val % 60;
              const formattedTime = h > 0 ? `${h}h ${m}m` : `${m}m`;
              return [formattedTime, 'Time'];
            }}
            contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#0f172a', fontWeight: 'bold', color: '#f8fafc' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
