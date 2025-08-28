
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import type { DataPoint, Settings } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const MAX_HISTORY_LENGTH = 30;

const initialSettings: Settings = {
  units: { temp: 'C' },
  alerts: {
    temp: { min: 10, max: 35 },
    ph: { min: 6.5, max: 8.5 },
    turbidity: { max: 50 },
    do: { min: 4 },
    lead: { max: 0.015 },
    copper: { max: 1.3 },
  },
  refreshInterval: 3000,
};

function generateNewDataPoint(lastData: DataPoint): DataPoint {
  const newPoint: DataPoint = {
    time: Date.now(),
    temp: lastData.temp + (Math.random() - 0.5) * 0.5,
    ph: lastData.ph + (Math.random() - 0.5) * 0.1,
    turbidity: lastData.turbidity + (Math.random() - 0.5) * 5,
    do: lastData.do + (Math.random() - 0.5) * 0.2,
    lead: lastData.lead + (Math.random() - 0.49) * 0.002, // Tend to slightly increase
    copper: lastData.copper + (Math.random() - 0.49) * 0.05, // Tend to slightly increase
  };

  // Clamp values to realistic ranges and format them
  newPoint.temp = parseFloat(Math.max(5, Math.min(45, newPoint.temp)).toFixed(1));
  newPoint.ph = parseFloat(Math.max(4, Math.min(10, newPoint.ph)).toFixed(1));
  newPoint.turbidity = parseFloat(Math.max(0, Math.min(200, newPoint.turbidity)).toFixed(0));
  newPoint.do = parseFloat(Math.max(0, Math.min(15, newPoint.do)).toFixed(1));
  newPoint.lead = parseFloat(Math.max(0, Math.min(0.1, newPoint.lead)).toFixed(4));
  newPoint.copper = parseFloat(Math.max(0, Math.min(2.5, newPoint.copper)).toFixed(3));


  return newPoint;
}

const getInitialData = (): DataPoint[] => {
    let lastPoint: DataPoint = { time: Date.now() - (MAX_HISTORY_LENGTH * 3000), temp: 25, ph: 7.5, turbidity: 10, do: 8, lead: 0.001, copper: 0.1 };
    const history = [lastPoint];
    for (let i = 0; i < MAX_HISTORY_LENGTH -1; i++) {
        lastPoint = generateNewDataPoint(history[i]);
        lastPoint.time = Date.now() - ((MAX_HISTORY_LENGTH - i - 1) * 3000);
        history.push(lastPoint);
    }
    return history;
}

export function useWaterQualityData() {
  const [isInitialized, setInitialized] = useState(false);
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [dataHistory, setDataHistory] = useState<DataPoint[]>([]);
  const [isRunning, setRunning] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  
  const currentData = dataHistory[dataHistory.length - 1];

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem('aquaview_settings');
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage", error);
    }
    setDataHistory(getInitialData());
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (isRunning && isInitialized) {
      intervalRef.current = setInterval(() => {
        setDataHistory(prevHistory => {
          const lastData = prevHistory[prevHistory.length - 1] ?? getInitialData()[0];
          const newData = generateNewDataPoint(lastData);
          const newHistory = [...prevHistory, newData];
          if (newHistory.length > MAX_HISTORY_LENGTH) {
            return newHistory.slice(newHistory.length - MAX_HISTORY_LENGTH);
          }
          return newHistory;
        });
      }, settings.refreshInterval);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, settings.refreshInterval, isInitialized]);

  const checkAlerts = useCallback((dataPoint: DataPoint) => {
    if (!dataPoint) return;
    if (dataPoint.ph < settings.alerts.ph.min || dataPoint.ph > settings.alerts.ph.max) {
      toast({ variant: 'destructive', title: 'pH Alert', description: `pH level is ${dataPoint.ph}, outside the normal range.` });
    }
    if (dataPoint.turbidity > settings.alerts.turbidity.max) {
      toast({ variant: 'destructive', title: 'Turbidity Alert', description: `Turbidity is ${dataPoint.turbidity} NTU, which is too high.` });
    }
     if (dataPoint.temp < settings.alerts.temp.min || dataPoint.temp > settings.alerts.temp.max) {
      toast({ variant: 'destructive', title: 'Temperature Alert', description: `Temperature is ${dataPoint.temp}°C, outside the safe range.` });
    }
     if (dataPoint.do < settings.alerts.do.min) {
      toast({ variant: 'destructive', title: 'Oxygen Alert', description: `Dissolved Oxygen is ${dataPoint.do} mg/L, which is too low.` });
    }
    if (dataPoint.lead > settings.alerts.lead.max) {
        toast({ variant: 'destructive', title: 'Lead Alert', description: `Lead concentration is ${dataPoint.lead} mg/L, exceeding the safe limit.` });
    }
    if (dataPoint.copper > settings.alerts.copper.max) {
        toast({ variant: 'destructive', title: 'Copper Alert', description: `Copper concentration is ${dataPoint.copper} mg/L, exceeding the safe limit.` });
    }
  }, [settings.alerts, toast]);

  useEffect(() => {
    if (currentData && isInitialized) {
      checkAlerts(currentData);
    }
  }, [currentData, isInitialized, checkAlerts]);


  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings, alerts: { ...prev.alerts, ...newSettings.alerts } };
      try {
        localStorage.setItem('aquaview_settings', JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to save settings to localStorage", error);
      }
      return updated;
    });
  };

  const toggleMonitoring = () => setRunning(prev => !prev);
  
  return {
    isInitialized,
    settings,
    updateSettings,
    dataHistory,
    currentData,
    isRunning,
    toggleMonitoring,
  };
}
