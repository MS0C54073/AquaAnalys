'use server';
/**
 * @fileOverview An AI flow for analyzing water quality data.
 *
 * - analyzeWaterQuality - A function that analyzes water quality based on sensor data and settings.
 * - WaterQualityAnalysisInput - The input type for the analysis function.
 * - WaterQualityAnalysis - The output type for the analysis function.
 */

import { ai } from '@/ai/genkit';
import {
  WaterQualityAnalysisInputSchema,
  WaterQualityAnalysisSchema,
  type WaterQualityAnalysis,
} from '@/lib/types';
import type { DataPoint, Settings } from '@/lib/types';

export async function analyzeWaterQuality(input: {currentData: DataPoint, settings: Settings}): Promise<WaterQualityAnalysis> {
  return analyzeWaterQualityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeWaterQualityPrompt',
  input: { schema: WaterQualityAnalysisInputSchema },
  output: { schema: WaterQualityAnalysisSchema },
  prompt: `You are AquaGuard, an AI assistant specializing in real-time water quality analysis for aquaculture. Your task is to provide a clear, concise, and actionable analysis of the provided sensor data.

Analyze the current sensor data based on the provided alert threshold settings.

**Current Sensor Data:**
- Temperature: {{{currentData.temp}}}°C
- pH: {{{currentData.ph}}}
- Turbidity: {{{currentData.turbidity}}} NTU
- Dissolved Oxygen (DO): {{{currentData.do}}} mg/L

**Alert Thresholds (Optimal Ranges):**
- Temperature: {{{settings.alerts.temp.min}}}-{{{settings.alerts.temp.max}}}°C
- pH: {{{settings.alerts.ph.min}}}-{{{settings.alerts.ph.max}}}
- Turbidity: < {{{settings.alerts.turbidity.max}}} NTU
- Dissolved Oxygen: > {{{settings.alerts.do.min}}} mg/L

**Your Response MUST include:**

1.  **Overall Status:** Determine if the overall status is 'Good', 'Warning', or 'Critical'.
    *   'Good': All parameters are within optimal ranges.
    *   'Warning': One or more parameters are slightly outside the optimal range but not at a dangerous level.
    *   'Critical': One or more parameters are at a dangerous level requiring immediate attention.
2.  **Summary:** A very brief, one-sentence overview of the situation.
3.  **Detailed Analysis:** Provide this as an array of objects. Create at least two sections: one for 'Key Observations' and another for 'Actionable Recommendations'.
    *   **Key Observations:** List the most important findings from the data. Mention which parameters are normal and which are outside the thresholds. Be specific.
    *   **Actionable Recommendations:** Based on the observations, provide clear, simple, and actionable steps the user should take. If all is well, state that no action is needed.

**Example for a critical state:**
- **Observation:** "Dissolved Oxygen is critically low at 2.5 mg/L."
- **Recommendation:** "Immediately increase aeration in the tank and check for equipment malfunctions."

Keep your language professional but easy to understand for a general user.`,
});

const analyzeWaterQualityFlow = ai.defineFlow(
  {
    name: 'analyzeWaterQualityFlow',
    inputSchema: WaterQualityAnalysisInputSchema,
    outputSchema: WaterQualityAnalysisSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('AI analysis failed to produce a result.');
    }
    return output;
  }
);
