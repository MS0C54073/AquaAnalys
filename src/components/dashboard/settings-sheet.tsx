"use client";

import { useData } from '@/contexts/data-provider';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

type SettingsSheetProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function SettingsSheet({ isOpen, onOpenChange }: SettingsSheetProps) {
  const { settings, updateSettings } = useData();
  
  const handleTempUnitChange = (value: 'C' | 'F') => {
    updateSettings({ units: { ...settings.units, temp: value } });
  };
  
  const handleAlertChange = (
    param: 'temp' | 'ph' | 'turbidity' | 'do',
    field: 'min' | 'max',
    value: string
  ) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updateSettings({
        alerts: {
          ...settings.alerts,
          [param]: {
            ...settings.alerts[param],
            [field]: numValue,
          },
        },
      });
    }
  };

  const handleIntervalChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 500) {
        updateSettings({ refreshInterval: numValue });
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-primary">Settings</SheetTitle>
          <SheetDescription>
            Adjust the monitoring parameters and alert thresholds.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-grow pr-4 -mr-6">
            <div className="space-y-6 py-4">
                <div>
                    <Label className="text-base font-semibold">General</Label>
                    <Separator className="my-2" />
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="temp-unit">Temperature Unit</Label>
                            <RadioGroup
                                id="temp-unit"
                                value={settings.units.temp}
                                onValueChange={handleTempUnitChange}
                                className="flex items-center"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="C" id="celsius" />
                                    <Label htmlFor="celsius">°C</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="F" id="fahrenheit" />
                                    <Label htmlFor="fahrenheit">°F</Label>
                                </div>
                            </RadioGroup>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="refresh-interval">Refresh Interval (ms)</Label>
                            <Input
                                id="refresh-interval"
                                type="number"
                                value={settings.refreshInterval}
                                onChange={(e) => handleIntervalChange(e.target.value)}
                                min="500"
                                step="100"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <Label className="text-base font-semibold">Alert Thresholds</Label>
                    <Separator className="my-2" />
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Temperature (°C)</Label>
                            <div className="flex gap-2">
                                <Input type="number" placeholder="Min" value={settings.alerts.temp.min} onChange={e => handleAlertChange('temp', 'min', e.target.value)} />
                                <Input type="number" placeholder="Max" value={settings.alerts.temp.max} onChange={e => handleAlertChange('temp', 'max', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>pH Level</Label>
                            <div className="flex gap-2">
                                <Input type="number" placeholder="Min" value={settings.alerts.ph.min} onChange={e => handleAlertChange('ph', 'min', e.target.value)} />
                                <Input type="number" placeholder="Max" value={settings.alerts.ph.max} onChange={e => handleAlertChange('ph', 'max', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Turbidity (NTU)</Label>
                            <Input type="number" placeholder="Max" value={settings.alerts.turbidity.max} onChange={e => handleAlertChange('turbidity', 'max', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Dissolved Oxygen (mg/L)</Label>
                            <Input type="number" placeholder="Min" value={settings.alerts.do.min} onChange={e => handleAlertChange('do', 'min', e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>
        </ScrollArea>
        <SheetFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full">Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
