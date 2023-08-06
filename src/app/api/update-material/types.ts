import { z } from 'zod';

export const updateMaterialBodySchema = z.object({
  courseName: z.string(),
  id: z.string(),
  instructors: z.array(z.string()),
  links: z.array(z.string()),
  publisherName: z.string(),
});

export type UpdateMaterialBody = z.output<typeof updateMaterialBodySchema>;
