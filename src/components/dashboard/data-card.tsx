import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type DataCardProps = {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function DataCard({ title, icon, children, className }: DataCardProps) {
  return (
    <Card className={cn("shadow-aqua border-primary/20 bg-card/80 backdrop-blur-sm flex flex-col transition-all duration-300 hover:border-primary/50", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium text-foreground/80">{title}</CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center">
        {children}
      </CardContent>
    </Card>
  );
}
