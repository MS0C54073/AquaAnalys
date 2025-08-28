import { z } from 'zod';

export type DataPoint = {
  time: number;
  temp: number;
  ph: number;
  turbidity: number;
  do: number;
  lead: number;
  copper: number;
};

export type Settings = {
  units: {
    temp: 'C' | 'F';
  };
  alerts: {
    temp: { min: number; max: number };
    ph: { min: number; max: number };
    turbidity: { max: number };
    do: { min: number };
    lead: { max: number };
    copper: { max: number };
  };
  refreshInterval: number;
};


// Zod Schemas for AI Flows
export const DataPointSchema = z.object({
  time: z.union([z.number(), z.string()]),
  temp: z.number(),
  ph: z.number(),
  turbidity: z.number(),
  do: z.number(),
  lead: z.number(),
  copper: z.number(),
});

export const SettingsSchema = z.object({
  units: z.object({ temp: z.enum(['C', 'F']) }),
  alerts: z.object({
    temp: z.object({ min: z.number(), max: z.number() }),
    ph: z.object({ min: z.number(), max: z.number() }),
    turbidity: z.object({ max: z.number() }),
    do: z.object({ min: z.number() }),
    lead: z.object({ max: z.number() }),
    copper: z.object({ max: z.number() }),
  }),
  refreshInterval: z.number(),
});

// Schemas for analyzeWaterQuality flow
export const WaterQualityAnalysisInputSchema = z.object({
  currentData: DataPointSchema.extend({ time: z.number() }), // Overriding time to be number for this specific schema
  settings: SettingsSchema,
});
export type WaterQualityAnalysisInput = z.infer<typeof WaterQualityAnalysisInputSchema>;

export const WaterQualityAnalysisSchema = z.object({
  overallStatus: z.enum(['Good', 'Warning', 'Critical']).describe('The overall status of the water quality.'),
  summary: z.string().describe('A concise, one-sentence summary of the current water quality status.'),
  detailedAnalysis: z.array(z.object({
      title: z.string().describe('The title of the analysis section (e.g., "Key Observations", "Potential Causes").'),
      points: z.array(z.string()).describe('A list of detailed observations or points for this section.')
  })).describe('An array of sections detailing the analysis.'),
});
export type WaterQualityAnalysis = z.infer<typeof WaterQualityAnalysisSchema>;


// Schemas for generateReport flow
export const ReportInputSchema = z.object({
  dataHistory: z.array(DataPointSchema),
  settings: SettingsSchema,
});
export type ReportInput = z.infer<typeof ReportInputSchema>;

export const ReportOutputSchema = z.object({
  report: z.string().describe('The full, formatted text report as a single string.'),
});
export type ReportOutput = z.infer<typeof ReportOutputSchema>;
