import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend, LineChart, Line, CartesianGrid, LabelList } from 'recharts';
import { renderToString } from 'react-dom/server';

const data = [
  { name: 'Mon', Morning: 2, Afternoon: 1, Night: 0, Other: 0, moodHeight: 0, mood: 'happy' }
];

const renderMoodIcon = (props: any) => {
  console.log("PROPS KEYS:", Object.keys(props));
  if (props.payload) {
     console.log("PAYLOAD:", props.payload);
  }
  if (props.value) {
     console.log("VALUE:", props.value);
  }
  return <g></g>;
};

const App = () => (
  <BarChart data={data} width={400} height={400}>
     <Bar dataKey="Morning" stackId="a" fill="#fde047" />
     <Bar dataKey="Afternoon" stackId="a" fill="#f97316" />
     <Bar dataKey="Night" stackId="a" fill="#6366f1" />
     <Bar dataKey="Other" stackId="a" fill="#64748b" />
     <Bar dataKey="moodHeight" stackId="a" fill="transparent" isAnimationActive={false}>
       <LabelList content={renderMoodIcon} />
     </Bar>
  </BarChart>
);

renderToString(<App />);
