import type { SVGProps } from 'react';

export function WaterClarityIcon({ level, ...props }: { level: 'good' | 'fair' | 'poor' } & SVGProps<SVGSVGElement>) {
  const wavePaths = {
    good: "M0,6 C10,0,20,12,30,6 S50,0,60,6",
    fair: "M0,6 C10,-3,20,15,30,6 S50,-3,60,6",
    poor: "M0,6 C8,-6,18,18,30,6 S42,-6,52,18,60,6",
  };
  const opacity = {
      good: 0.2,
      fair: 0.5,
      poor: 0.8
  }

  return (
    <svg viewBox="0 0 60 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d={wavePaths[level]} />
      <path d="M0,0 H60 V12 H0 Z" fill="currentColor" opacity={opacity[level]} stroke="none" />
    </svg>
  );
}
