"use client";

import React from 'react';
import { DataProvider, useData } from '@/contexts/data-provider';
import Header from '@/components/dashboard/header';
import TemperatureCard from '@/components/dashboard/temperature-card';
import PhCard from '@/components/dashboard/ph-card';
import TurbidityCard from '@/components/dashboard/turbidity-card';
import DissolvedOxygenCard from '@/components/dashboard/dissolved-oxygen-card';
import LeadCard from '@/components/dashboard/lead-card';
import CopperCard from '@/components/dashboard/copper-card';
import LiveChart from '@/components/dashboard/live-chart';
import Controls from '@/components/dashboard/controls';
import SettingsSheet from '@/components/dashboard/settings-sheet';
import AnalystCard from '@/components/dashboard/analyst-card';
import { Skeleton } from '@/components/ui/skeleton';

function Dashboard() {
  const { isInitialized } = useData();
  const [isSettingsOpen, setSettingsOpen] = React.useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <Header onSettingsClick={() => setSettingsOpen(true)} />
      
      <main className="flex-grow my-6">
        {isInitialized ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <div className="lg:col-span-1 xl:col-span-2"><TemperatureCard /></div>
            <div className="lg:col-span-1 xl:col-span-2"><PhCard /></div>
            <div className="lg:col-span-1 xl:col-span-2"><TurbidityCard /></div>
            <div className="lg:col-span-1 xl:col-span-2"><DissolvedOxygenCard /></div>
            <div className="lg:col-span-1 xl:col-span-2"><LeadCard /></div>
            <div className="lg:col-span-1 xl-col-span-2"><CopperCard /></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <Skeleton className="h-[220px] rounded-lg" />
            <Skeleton className="h-[220px] rounded-lg" />
            <Skeleton className="h-[220px] rounded-lg" />
            <Skeleton className="h-[220px] rounded-lg" />
            <Skeleton className="h-[220px] rounded-lg" />
            <Skeleton className="h-[220px] rounded-lg" />
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            {isInitialized ? (
              <LiveChart />
            ) : (
              <Skeleton className="h-[400px] w-full rounded-lg" />
            )}
          </div>
          <div className="lg:col-span-1">
             {isInitialized ? (
              <AnalystCard />
            ) : (
              <Skeleton className="h-[400px] w-full rounded-lg" />
            )}
          </div>
        </div>
      </main>
      
      <Controls onSettingsClick={() => setSettingsOpen(true)} />

      <SettingsSheet isOpen={isSettingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}

export default function Home() {
  return (
    <DataProvider>
      <Dashboard />
    </DataProvider>
  );
}
