"use client";

import { Bot, RefreshCw, AlertTriangle, CheckCircle, Lightbulb, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '../ui/button';
import { useData } from '@/contexts/data-provider';
import React from 'react';
import { analyzeWaterQuality } from '@/ai/flows/analyze-water-quality';
import type { WaterQualityAnalysis } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Good':
            return <Badge variant="secondary" className="bg-green-600/20 text-green-300 border-none"><CheckCircle className="mr-1 h-3 w-3" />Good</Badge>;
        case 'Warning':
            return <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-300 border-none"><AlertTriangle className="mr-1 h-3 w-3" />Warning</Badge>;
        case 'Critical':
            return <Badge variant="destructive"><AlertTriangle className="mr-1 h-3 w-3" />Critical</Badge>;
        default:
            return <Badge>{status}</Badge>;
    }
}

const getIconForSection = (title: string) => {
    if (title.includes('Overall')) return <TrendingUp />;
    if (title.includes('Recommendations')) return <Lightbulb />;
    return <Bot />;
}

export default function AnalystCard() {
    const { currentData, settings, isInitialized } = useData();
    const [analysis, setAnalysis] = React.useState<WaterQualityAnalysis | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const performAnalysis = React.useCallback(async () => {
        if (!currentData) return;
        setIsLoading(true);
        setError(null);
        try {
            const result = await analyzeWaterQuality({
                currentData: currentData,
                settings: settings,
            });
            setAnalysis(result);
        } catch (e) {
            console.error(e);
            setError("Failed to get analysis. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [currentData, settings]);

    React.useEffect(() => {
        if (isInitialized) {
            performAnalysis();
        }
    }, [isInitialized, performAnalysis]);


    return (
        <Card className="shadow-aqua border-primary/20 bg-card/80 backdrop-blur-sm h-full flex flex-col">
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle className="text-primary flex items-center gap-2">
                        <Bot />
                        AquaGuard Analyst
                    </CardTitle>
                    <CardDescription>AI-Powered Insights</CardDescription>
                </div>
                 <Button variant="ghost" size="icon" onClick={performAnalysis} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                 </Button>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
                <ScrollArea className="h-full pr-4 -mr-6">
                {isLoading && !analysis ? (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <div className="pt-4 space-y-4">
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-4 w-full" />
                             <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                ) : error ? (
                    <div className="text-destructive text-center flex flex-col items-center justify-center h-full">
                        <AlertTriangle className="h-8 w-8 mb-2" />
                        <p>{error}</p>
                    </div>
                ) : analysis ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">Overall Status</h3>
                            {getStatusBadge(analysis.overallStatus)}
                        </div>
                        <p className="text-sm text-muted-foreground">{analysis.summary}</p>

                        {analysis.detailedAnalysis.map((section, index) => (
                            <div key={index} className="pt-4 border-t border-border/50">
                                <h4 className="font-semibold flex items-center gap-2 mb-2">
                                    {getIconForSection(section.title)}
                                    {section.title}
                                </h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    {section.points.map((point, i) => (
                                        <li key={i}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground">No analysis available.</div>
                )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
