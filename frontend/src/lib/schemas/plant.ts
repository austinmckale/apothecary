import { z } from 'zod';

export const plantSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers, and hyphens'),
  species: z.string().optional().or(z.literal('')),
  cultivar: z.string().optional().or(z.literal('')),
  light_requirements: z.string().optional().or(z.literal('')),
  water_schedule: z.string().optional().or(z.literal('')),
  temperature_range: z.string().optional().or(z.literal('')),
  humidity_range: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  care_notes: z.string().optional().or(z.literal('')),
  is_public: z.boolean().default(true),
});

export type PlantInput = z.infer<typeof plantSchema>;


