"use client";

import DataCard from './data-card';
import { useData } from '@/contexts/data-provider';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

function CopperIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-atom">
            <circle cx="12" cy="12" r="1"/>
            <path d="M20.2 20.2c2.04-2.03.02-5.72-2.3-8C15.5 9.8 12.2 7 12 5c-.2-2-2.3-3.8-4.5-3.8S3.2 2.8 3 5c-.2 2-2.3 3.8-4.5 3.8S-3.2 13.2 1 15.5"/>
            <path d="M15.5 1C13.2-1.2 9.8.02 7.5 2.3 5.2 4.5 7 7.8 5 8c-2 .2-3.8 2.3-3.8 4.5s1.8 4.3 4 4.5c2 .2 3.8 2.3 3.8 4.5s1.8 4.3 4 4.5c2 .2 3.8 2.3 3.8 4.5s1.8 4.3 4 4.5"/>
        </svg>
    )
}

export default function CopperCard() {
  const { currentData, settings } = useData();

  if (!currentData) return null;

  const { copper } = currentData;
  const { max } = settings.alerts.copper;

  const isHigh = copper > max;

  let StatusIcon = ShieldCheck;
  let statusColor = 'text-green-400';

  if (isHigh) {
    StatusIcon = ShieldAlert;
    statusColor = 'text-destructive';
  }

  const percentage = Math.min(100, Math.round((copper / max) * 100));

  return (
    <DataCard title="Copper Concentration" icon={<CopperIcon />}>
      <div className="flex items-end justify-between">
        <div>
            <div className="text-4xl font-bold text-primary">
                {copper.toFixed(3)}
                <span className="text-lg text-foreground/60 ml-1">mg/L</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
                Max safe limit: {max} mg/L
            </p>
        </div>
        <div className="w-24 h-12 flex items-end">
            <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full ${isHigh ? 'bg-destructive' : 'bg-primary'}`}
                    style={{ width: `${percentage}%`}}
                ></div>
            </div>
        </div>
      </div>
      <div className={`flex items-center gap-2 mt-2 ${statusColor}`}>
        <StatusIcon className="h-4 w-4" />
        <span className="font-semibold text-sm">{isHigh ? 'Limit Exceeded' : 'Within Limit'}</span>
      </div>
    </DataCard>
  );
}
