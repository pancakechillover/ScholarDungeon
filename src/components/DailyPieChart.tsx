import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { StudySession, Dungeon, MajorDungeon } from '../types';
import { format, differenceInMinutes, parseISO, startOfDay, endOfDay, isSameDay } from 'date-fns';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#3b82f6'];
const T_COLORS = ['#6366f155', '#10b98155', '#f59e0b55', '#ef444455', '#8b5cf655', '#ec489955', '#3b82f655'];

interface Props {
  date: Date;
  history: StudySession[];
  dungeons: Dungeon[];
  majorDungeons: MajorDungeon[];
  mode: '24h' | 'compact';
}

export const DailyPieChart: React.FC<Props> = ({ date, history, dungeons, majorDungeons, mode }) => {
  const chartData = useMemo(() => {
    const daySessions = history.filter(s => s.timestamp && isSameDay(parseISO(s.timestamp), date));
    
    const getDungeonName = (id: string) => {
      if (id === 'free_study') return 'Free Study';
      const d = dungeons.find(d => d.id === id);
      if (d) return d.name;
      const m = majorDungeons.find(m => m.id === id);
      if (m) return m.name;
      return 'Unknown';
    };

    if (mode === 'compact') {
      const grouped: Record<string, number> = {};
      daySessions.forEach(s => {
        const name = getDungeonName(s.dungeonId);
        grouped[name] = (grouped[name] || 0) + (s.duration || 0);
      });
      return Object.entries(grouped).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);
    } else {
      // 24h mode
      // Group by hours or just visual representation out of 1440 minutes. 
      // The requirement says "展示记录的活动在当天所占据的时间".
      // We can create a ring of 1440 slices where active time gets color and idle time gets transparent/gray?
      // Recharts pie chart doesn't do a time-based 24h ring easily unless we carefully measure segments.
      // Easiest is segmenting properly by blocks of events + idle time.
      const segments: { name: string; value: number; isIdle: boolean; realName?: string }[] = [];
      const dayStart = startOfDay(date);
      
      const sorted = [...daySessions].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      let currentMinute = 0; // 0 to 1440
      
      sorted.forEach(s => {
        const stDate = new Date(s.timestamp);
        // Start time is timestamp minus duration if we assume timestamp is end time?
        // Wait, standard AppState history timestamp is usually END time.
        // Let's assume timestamp is end time.
        const duration = (s.duration || 0);
        const endMinute = differenceInMinutes(stDate, dayStart);
        const startMinute = Math.max(0, endMinute - duration);

        if (startMinute > currentMinute) {
          segments.push({ name: 'Idle', value: startMinute - currentMinute, isIdle: true });
        }
        
        // Add session
        if (duration > 0) {
          segments.push({ 
            name: getDungeonName(s.dungeonId), 
            realName: getDungeonName(s.dungeonId),
            value: Math.min(1440 - Math.max(currentMinute, startMinute), duration),
            isIdle: false 
          });
        }
        currentMinute = Math.max(currentMinute, endMinute);
      });

      if (currentMinute < 1440) {
        segments.push({ name: 'Idle', value: 1440 - currentMinute, isIdle: true });
      }

      return segments;
    }
  }, [history, date, dungeons, majorDungeons, mode]);

  if (!chartData.length || (mode === 'compact' && chartData.reduce((a, b) => a + b.value, 0) === 0)) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 font-bold italic">
        No records this day
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
            paddingAngle={mode === 'compact' ? 2 : 0}
            dataKey="value"
            stroke="none"
            startAngle={mode === '24h' ? 90 : 90} // Start at 12 o'clock for 24h mode
            endAngle={mode === '24h' ? -270 : -270}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={mode === '24h' ? (entry.isIdle ? '#1e293b' : COLORS[index % COLORS.length]) : COLORS[index % COLORS.length]} 
                opacity={mode === '24h' && entry.isIdle ? 0.3 : 1}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(val: number, name: string, props: any) => {
              if (props?.payload?.isIdle) return ['...', 'Idle'];
              const h = Math.floor(val / 60);
              const m = val % 60;
              const formattedTime = h > 0 ? `${h}h ${m}m` : `${m}m`;
              return [formattedTime, props?.payload?.realName || name];
            }}
            contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#0f172a', fontWeight: 'bold', color: '#f8fafc' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
