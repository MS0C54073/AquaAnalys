"use client";

import { useData } from '@/contexts/data-provider';
import { Button } from '@/components/ui/button';
import { Play, Pause, FileDown, Settings, Bot, Beaker } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast';
import React from 'react';
import { generateReport } from '@/ai/flows/generate-report-flow';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ScrollArea } from '../ui/scroll-area';

type ControlsProps = {
  onSettingsClick: () => void;
};

export default function Controls({ onSettingsClick }: ControlsProps) {
  const { isRunning, toggleMonitoring, dataHistory, settings, setSimulationPreset } = useData();
  const { toast } = useToast();
  const [isReportDialogOpen, setReportDialogOpen] = React.useState(false);
  const [reportContent, setReportContent] = React.useState("");
  const [isGenerating, setGenerating] = React.useState(false);

  const handleExport = (format: 'CSV') => {
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

  const handleGenerateReport = async () => {
    setGenerating(true);
    setReportDialogOpen(true);
    setReportContent("");
    try {
      const { report } = await generateReport({
        dataHistory: dataHistory,
        settings: settings
      });
      setReportContent(report);
    } catch (error) {
      console.error("Failed to generate report", error);
      toast({
        variant: 'destructive',
        title: 'Report Generation Failed',
        description: 'Could not generate AI report. Please try again.'
      })
      setReportDialogOpen(false);
    } finally {
      setGenerating(false);
    }
  }

  const downloadReport = () => {
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `aquaview-report-${new Date().toISOString()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: 'Report Downloaded',
      description: 'The analysis report has been saved.',
    });
  }

  const handleSimulationPreset = (preset: 'clean' | 'fair' | 'dirty') => {
    setSimulationPreset(preset);
    toast({
      title: `Simulation Set to ${preset.charAt(0).toUpperCase() + preset.slice(1)}`,
      description: `Water quality parameters have been adjusted.`,
    });
  };

  return (
    <>
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
              <FileDown className="mr-2" /> Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleExport('CSV')}>
              Export Raw Data as CSV
            </DropdownMenuItem>
            <DropdownMenuSeparator />
             <DropdownMenuItem onClick={handleGenerateReport}>
              <Bot className="mr-2" />
              Generate AI Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="lg" className="active:scale-95 transition-transform">
              <Beaker className="mr-2" /> Simulate
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleSimulationPreset('clean')}>
              Clean Environment
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSimulationPreset('fair')}>
              Fair Environment
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSimulationPreset('dirty')}>
              Dirty Environment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={onSettingsClick} variant="outline" size="lg" className="active:scale-95 transition-transform">
          <Settings className="mr-2" /> Settings
        </Button>
      </footer>

      <AlertDialog open={isReportDialogOpen} onOpenChange={setReportDialogOpen}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-primary flex items-center gap-2">
              <Bot /> AquaGuard AI Report
            </AlertDialogTitle>
            <AlertDialogDescription>
              A comprehensive analysis of the latest water quality data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <ScrollArea className="max-h-[60vh] pr-6 -mr-6">
            {isGenerating ? (
              <div className="space-y-4">
                <p>Generating your report, please wait...</p>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-2 rounded-full bg-primary animate-pulse w-full"></div>
                </div>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">{reportContent}</pre>
            )}
          </ScrollArea>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction onClick={downloadReport} disabled={isGenerating || !reportContent}>
              Download Report
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
