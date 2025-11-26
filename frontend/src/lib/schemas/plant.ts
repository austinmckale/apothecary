import { z } from 'zod';

export const plantSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers, and hyphens'),
  category: z.enum(['syngonium', 'alocasia', 'begonia', 'other']).nullable().optional(),
  species: z.string().optional().or(z.literal('')),
  cultivar: z.string().optional().or(z.literal('')),
  stage: z.enum(['corm', 'pup', 'juvenile', 'mature']).nullable().optional(),
  root_status: z.enum(['unrooted', 'lightly_rooted', 'rooted']).nullable().optional(),
  price_cents: z.number().min(0).nullable().optional(),
  in_stock: z.boolean().default(false),
  quantity: z.number().min(0).default(0),
  light_requirements: z.string().optional().or(z.literal('')),
  water_schedule: z.string().optional().or(z.literal('')),
  temperature_range: z.string().optional().or(z.literal('')),
  humidity_range: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  care_notes: z.string().optional().or(z.literal('')),
  is_public: z.boolean().default(true),
});

export type PlantInput = z.infer<typeof plantSchema>;
