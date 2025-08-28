"use client";

import { useData } from '@/contexts/data-provider';
import { Button } from '@/components/ui/button';
import { Play, Pause, FileDown, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast';

type ControlsProps = {
  onSettingsClick: () => void;
};

export default function Controls({ onSettingsClick }: ControlsProps) {
  const { isRunning, toggleMonitoring } = useData();
  const { toast } = useToast();

  const handleExport = (format: 'CSV' | 'PDF') => {
    toast({
      title: 'Exporting Data',
      description: `Generating mock ${format} file...`,
    });
    // Mock download
    setTimeout(() => {
        toast({
            title: 'Export Complete',
            description: `Your mock ${format} file has been "downloaded".`,
        });
    }, 1500)
  };

  return (
    <footer className="flex items-center justify-center gap-4 mt-6">
      <Button 
        onClick={toggleMonitoring} 
        size="lg" 
        className="w-40 bg-primary/90 hover:bg-primary text-primary-foreground active:scale-95 transition-transform"
        aria-label={isRunning ? "Stop monitoring" : "Start monitoring"}
      >
        {isRunning ? <Pause className="mr-2" /> : <Play className="mr-2" />}
        {isRunning ? 'Stop' : 'Start'}
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="lg" className="active:scale-95 transition-transform">
            <FileDown className="mr-2" /> Export Data
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleExport('CSV')}>Export as CSV</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('PDF')}>Export as PDF</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button onClick={onSettingsClick} variant="outline" size="lg" className="active:scale-95 transition-transform">
        <Settings className="mr-2" /> Settings
      </Button>
    </footer>
  );
}
