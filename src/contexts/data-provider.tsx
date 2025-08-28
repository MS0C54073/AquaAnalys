"use client";

import React, { createContext, useContext } from 'react';
import { useWaterQualityData } from '@/hooks/use-water-quality-data';

type DataContextType = ReturnType<typeof useWaterQualityData>;

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const data = useWaterQualityData();
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
