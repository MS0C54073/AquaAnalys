"use client";

import { Thermometer, TrendUp, TrendDown, Minus } from 'lucide-react';
import DataCard from './data-card';
import { useData } from '@/contexts/data-provider';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function TemperatureCard() {
  const { currentData, dataHistory, settings } = useData();

  if (!currentData) return null;

  const tempValue = settings.units.temp === 'F' ? (currentData.temp * 9/5 + 32).toFixed(1) : currentData.temp.toFixed(1);
  const unit = `°${settings.units.temp}`;

  const trendData = dataHistory.slice(-2);
  let TrendIcon = Minus;
  if (trendData.length > 1) {
    if (trendData[1].temp > trendData[0].temp) {
      TrendIcon = TrendUp;
    } else if (trendData[1].temp < trendData[0].temp) {
      TrendIcon = TrendDown;
    }
  }

  const sparklineData = dataHistory.slice(-10).map(d => ({ temp: d.temp }));

  return (
    <DataCard title="Temperature" icon={<Thermometer size={24} />}>
      <div className="flex-grow flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="text-4xl font-bold text-primary">
            {tempValue}
            <span className="text-2xl text-foreground/60 ml-1">{unit}</span>
          </div>
          <div className={`flex items-center gap-1 ${TrendIcon === TrendUp ? 'text-green-400' : TrendIcon === TrendDown ? 'text-red-400' : 'text-foreground/60'}`}>
            <TrendIcon size={20} />
          </div>
        </div>
        <div className="h-20 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="temp" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorTemp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DataCard>
  );
}
