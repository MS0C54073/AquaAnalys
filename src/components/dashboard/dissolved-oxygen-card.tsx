"use client";

import DataCard from './data-card';
import { useData } from '@/contexts/data-provider';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

function WindIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
            <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
            <path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
        </svg>
    )
}

const OPTIMAL_DO = 10; // mg/L as 100%

export default function DissolvedOxygenCard() {
  const { currentData, settings } = useData();

  if (!currentData) return null;

  const { do: doValue } = currentData;
  const percentage = Math.round((doValue / OPTIMAL_DO) * 100);

  let color = 'hsl(var(--primary))';
  if (doValue < settings.alerts.do.min) {
    color = 'hsl(var(--destructive))';
  } else if (doValue < settings.alerts.do.min + 2) {
    color = 'hsl(var(--chart-3))';
  }
  
  const chartData = [{ name: 'DO', value: percentage, fill: color }];

  return (
    <DataCard title="Dissolved Oxygen" icon={<WindIcon />}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-4xl font-bold text-primary">
            {doValue.toFixed(1)}
            <span className="text-lg text-foreground/60 ml-1">mg/L</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Min required: {settings.alerts.do.min} mg/L
          </p>
        </div>
        <div className="h-24 w-24">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="70%"
              outerRadius="100%"
              data={chartData}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar
                background={{ fill: 'hsla(var(--muted), 0.5)' }}
                dataKey="value"
                cornerRadius={10}
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground text-xl font-bold"
              >
                {`${percentage}%`}
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DataCard>
  );
}
