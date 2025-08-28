"use client";

import DataCard from './data-card';
import { useData } from '@/contexts/data-provider';
import { AlertTriangle, CheckCircle, Biohazard } from 'lucide-react';

export default function LeadCard() {
  const { currentData, settings } = useData();

  if (!currentData) return null;

  const { lead } = currentData;
  const { max } = settings.alerts.lead;

  const isCritical = lead > max;
  const isWarning = lead > max * 0.75;

  let StatusIcon = CheckCircle;
  let statusColor = 'text-green-400';
  let statusText = 'Safe';

  if (isCritical) {
    StatusIcon = Biohazard;
    statusColor = 'text-destructive';
    statusText = 'Critical';
  } else if (isWarning) {
    StatusIcon = AlertTriangle;
    statusColor = 'text-yellow-400';
    statusText = 'Warning';
  }

  return (
    <DataCard title="Lead Concentration" icon={<Biohazard />}>
      <div className="flex items-center justify-between">
        <div>
            <div className="text-4xl font-bold text-primary">
                {lead.toFixed(4)}
                <span className="text-lg text-foreground/60 ml-1">mg/L</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
                Max safe limit: {max} mg/L
            </p>
        </div>
        <div className={`flex flex-col items-center ${statusColor}`}>
            <StatusIcon className="h-10 w-10" />
            <span className="font-bold mt-1">{statusText}</span>
        </div>
      </div>
    </DataCard>
  );
}
