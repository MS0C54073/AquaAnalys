"use client";

import { useData } from '@/contexts/data-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { format } from 'date-fns';

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const time = format(new Date(label), 'HH:mm:ss');
    return (
      <div className="p-2 bg-background/80 backdrop-blur-sm border rounded-lg shadow-aqua">
        <p className="text-sm font-bold text-primary">{`${time}`}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="text-sm">{`${p.name}: ${p.value}`}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function LiveChart() {
  const { dataHistory } = useData();

  const chartData = dataHistory.map(d => ({
    ...d,
    time: d.time,
  }));

  return (
    <Card className="shadow-aqua border-primary/20 bg-card/80 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="text-primary">Live Sensor Data</CardTitle>
      </CardHeader>
      <CardContent className="h-[350px] lg:h-[calc(100%-80px)] w-full">
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <XAxis 
              dataKey="time" 
              tickFormatter={(time) => format(new Date(time), 'HH:mm')}
              stroke="hsl(var(--foreground) / 0.7)"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis yAxisId="left" stroke="hsl(var(--foreground) / 0.7)" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
             <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--foreground) / 0.7)" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
            <Line yAxisId="left" type="monotone" dataKey="temp" name="Temp (°C)" stroke="hsl(var(--chart-1))" dot={false} strokeWidth={2} />
            <Line yAxisId="left" type="monotone" dataKey="ph" name="pH" stroke="hsl(var(--chart-2))" dot={false} strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="turbidity" name="Turbidity (NTU)" stroke="hsl(var(--chart-3))" dot={false} strokeWidth={2} />
            <Line yAxisId="left" type="monotone" dataKey="do" name="DO (mg/L)" stroke="hsl(var(--chart-4))" dot={false} strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="lead" name="Lead (mg/L)" stroke="hsl(var(--chart-5))" dot={false} strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="copper" name="Copper (mg/L)" stroke="hsl(var(--chart-1))" strokeDasharray="3 3" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
