import React from 'react';
import { BarChart, Bar, LabelList } from 'recharts';
import { renderToStaticMarkup } from 'react-dom/server';

const data = [
  { name: 'Mon', Morning: 2, moodHeight: 0, mood: 'happy' }
];

const renderMoodIcon = (props: any) => {
  console.log("PROPS.payload:", JSON.stringify(props.payload, null, 2));
  console.log("PROPS.value:", props.value);
  return <g></g>;
};

const App = () => (
  <BarChart data={data} width={400} height={400}>
     <Bar dataKey="Morning" stackId="a" />
     <Bar dataKey="moodHeight" stackId="a" isAnimationActive={false}>
       <LabelList content={renderMoodIcon} />
     </Bar>
  </BarChart>
);

renderToStaticMarkup(<App />);
