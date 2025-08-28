"use client";

import { Wifi, BatteryFull, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

type HeaderProps = {
  onSettingsClick: () => void;
};

export default function Header({ onSettingsClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <h1 className="text-2xl md:text-3xl font-bold text-primary">
        AquaView
      </h1>
      <div className="flex items-center gap-2 md:gap-4">
        <Wifi className="text-primary" size={24} />
        <BatteryFull className="text-primary" size={24} />
        <Button variant="ghost" size="icon" onClick={onSettingsClick} aria-label="Settings">
          <Settings className="text-primary" size={24} />
        </Button>
      </div>
    </header>
  );
}
