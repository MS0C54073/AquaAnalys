"use client";

import DataCard from './data-card';
import { useData } from '@/contexts/data-provider';

function PhIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 12.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/>
            <path d="M12 15V6.5A2.5 2.5 0 0 1 14.5 4h0A2.5 2.5 0 0 1 17 6.5V15"/>
            <path d="M12 15V9.5A2.5 2.5 0 0 0 9.5 7h0A2.5 2.5 0 0 0 7 9.5V15"/>
            <path d="M18 15c0 2.5-1.5 5-3 5s-3-2.5-3-5"/>
            <path d="M6 15c0 2.5 1.5 5 3 5s3-2.5 3-5"/>
        </svg>
    )
}

export default function PhCard() {
  const { currentData, settings } = useData();

  if (!currentData) return null;

  const { ph } = currentData;
  const { min, max } = settings.alerts.ph;

  let statusColor = 'text-green-400';
  let statusText = 'Normal';
  if (ph < min || ph > max) {
    statusColor = 'text-destructive';
    statusText = 'Critical';
  } else if (ph < min + 0.5 || ph > max - 0.5) {
    statusColor = 'text-yellow-400';
    statusText = 'Warning';
  }

  return (
    <DataCard title="pH Level" icon={<PhIcon />}>
      <div className="text-4xl font-bold text-primary">{ph.toFixed(1)}</div>
      <div className={`mt-2 font-semibold ${statusColor}`}>{statusText}</div>
      <p className="text-xs text-muted-foreground mt-1">
        Reference range: {min} - {max} pH
      </p>
    </DataCard>
  );
}
