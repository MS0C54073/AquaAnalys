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
  },
  refreshInterval: 3000,
};

function generateNewDataPoint(lastData: DataPoint): DataPoint {
  const newPoint: DataPoint = {
    time: Date.now(),
    temp: parseFloat((lastData.temp + (Math.random() - 0.5) * 0.5).toFixed(1)),
    ph: parseFloat((lastData.ph + (Math.random() - 0.5) * 0.1).toFixed(1)),
    turbidity: Math.max(0, parseFloat((lastData.turbidity + (Math.random() - 0.5) * 5).toFixed(0))),
    do: Math.max(0, parseFloat((lastData.do + (Math.random() - 0.5) * 0.2).toFixed(1))),
  };

  // Clamp values to realistic ranges
  newPoint.temp = Math.max(5, Math.min(45, newPoint.temp));
  newPoint.ph = Math.max(4, Math.min(10, newPoint.ph));
  newPoint.turbidity = Math.max(0, Math.min(200, newPoint.turbidity));
  newPoint.do = Math.max(0, Math.min(15, newPoint.do));

  return newPoint;
}

const getInitialData = (): DataPoint[] => {
    const initialPoint: DataPoint = { time: Date.now(), temp: 25.3, ph: 7.2, turbidity: 12, do: 8.1 };
    const history = [initialPoint];
    for (let i = 0; i < MAX_HISTORY_LENGTH -1; i++) {
        history.unshift(generateNewDataPoint(history[0]));
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

  const checkAlerts = useCallback((dataPoint: DataPoint) => {
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
  }, [settings.alerts, toast]);

  useEffect(() => {
    if (isRunning && isInitialized) {
      intervalRef.current = setInterval(() => {
        setDataHistory(prevHistory => {
          const lastData = prevHistory[prevHistory.length - 1] ?? getInitialData()[0];
          const newData = generateNewDataPoint(lastData);
          checkAlerts(newData);
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
  }, [isRunning, settings.refreshInterval, isInitialized, checkAlerts]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('aquaview_settings', JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to save settings to localStorage", error);
      }
      return updated;
    });
  };

  const toggleMonitoring = () => setRunning(prev => !prev);
  
  const currentData = dataHistory[dataHistory.length - 1];

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
