'use server';
/**
 * @fileOverview An AI flow for generating a full report on water quality data history.
 *
 * - generateReport - Generates a text-based report.
 * - ReportInputSchema - The input type for the report generation function.
 * - ReportOutputSchema - The return type for the report generation function.
 */

import { ai } from '@/ai/genkit';
import { 
  ReportInputSchema, 
  ReportOutputSchema, 
  type ReportOutput 
} from '@/lib/types';
import type { DataPoint, Settings } from '@/lib/types';
import { format } from 'date-fns';

export async function generateReport(input: {dataHistory: DataPoint[], settings: Settings}): Promise<ReportOutput> {
  const formattedHistory = input.dataHistory.map(p => ({
    ...p,
    time: format(new Date(p.time), 'yyyy-MM-dd HH:mm:ss'),
  })).slice(-10); // Use last 10 points for brevity

  return generateReportFlow({ ...input, dataHistory: formattedHistory as any });
}

const prompt = ai.definePrompt({
  name: 'generateReportPrompt',
  input: { schema: ReportInputSchema },
  output: { schema: ReportOutputSchema },
  prompt: `You are AquaGuard, a water quality analysis AI. Your task is to generate a comprehensive, professional report based on the provided data history and settings. The report should be formatted as a single block of text, using markdown for structure.

**Analysis Period:**
- Start: {{dataHistory.0.time}}
- End: {{dataHistory.9.time}}

**Alert Thresholds (Optimal Ranges):**
- Temperature: {{{settings.alerts.temp.min}}}-{{{settings.alerts.temp.max}}}°C
- pH: {{{settings.alerts.ph.min}}}-{{{settings.alerts.ph.max}}}
- Turbidity: < {{{settings.alerts.turbidity.max}}} NTU
- Dissolved Oxygen: > {{{settings.alerts.do.min}}} mg/L
- Lead: < {{{settings.alerts.lead.max}}} mg/L
- Copper: < {{{settings.alerts.copper.max}}} mg/L

**Data Summary (Last 10 points):**
{{#each dataHistory}}
- [{{time}}] Temp: {{temp}}°C, pH: {{ph}}, Turbidity: {{turbidity}} NTU, DO: {{do}} mg/L, Lead: {{lead}} mg/L, Copper: {{copper}} mg/L
{{/each}}

**Instructions for Report Generation:**

Generate a report with the following sections, formatted using markdown syntax:

1.  **# AquaView Water Quality Report**
    *   Include the date range of the analysis.

2.  **## 1. Executive Summary**
    *   Provide a high-level overview of the water quality during the period.
    *   State the overall assessment (e.g., Stable, Minor Fluctuations, Critical Alert).
    *   Mention if any parameters consistently breached thresholds.

3.  **## 2. Detailed Parameter Analysis**
    *   For each parameter (Temperature, pH, Turbidity, Dissolved Oxygen, Lead, Copper):
        *   Provide a subheading (e.g., '### Temperature').
        *   Describe its trend over the period (e.g., stable, increasing, fluctuating).
        *   Note any violations of the defined thresholds.
        *   Calculate and state the average value.

4.  **## 3. Key Events & Anomalies**
    *   Identify and describe any significant events, such as sudden spikes or drops in any parameter.
    *   Correlate events if possible (e.g., "a drop in DO coincided with a spike in temperature"). If no anomalies, state that the parameters were stable.

5.  **## 4. Recommendations**
    *   Provide actionable recommendations based on the analysis.
    *   If there are issues, suggest specific actions (e.g., "Monitor aeration system due to fluctuating DO levels").
    *   If the water quality is good, recommend continuing current practices.

The final output should be a single string containing the full, formatted report.`,
});

const generateReportFlow = ai.defineFlow(
  {
    name: 'generateReportFlow',
    inputSchema: ReportInputSchema,
    outputSchema: ReportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('AI report generation failed.');
    }
    return output;
  }
);
