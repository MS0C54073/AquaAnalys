"use client";

import { Droplets } from 'lucide-react';
import DataCard from './data-card';
import { useData } from '@/contexts/data-provider';
import { WaterClarityIcon } from './icons';

export default function TurbidityCard() {
  const { currentData } = useData();

  if (!currentData) return null;

  const { turbidity } = currentData;

  let quality: 'Good' | 'Fair' | 'Poor' = 'Good';
  let clarityLevel: 'good' | 'fair' | 'poor' = 'good';
  let qualityColor = 'text-green-400';

  if (turbidity > 50) {
    quality = 'Poor';
    clarityLevel = 'poor';
    qualityColor = 'text-destructive';
  } else if (turbidity > 5) {
    quality = 'Fair';
    clarityLevel = 'fair';
    qualityColor = 'text-yellow-400';
  }

  return (
    <DataCard title="Turbidity" icon={<Droplets size={24} />}>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-primary">{turbidity.toFixed(0)}</span>
        <span className="text-lg text-foreground/60">NTU</span>
      </div>
      <div className="flex items-center gap-4 mt-2">
        <WaterClarityIcon level={clarityLevel} className="w-12 h-12 text-primary" />
        <div>
          <p className="font-semibold">Quality</p>
          <p className={`${qualityColor} font-bold text-lg`}>{quality}</p>
        </div>
      </div>
    </DataCard>
  );
}
