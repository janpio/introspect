import { z } from 'zod';

export const removeMaterialFromListBodySchema = z.object({
  listId: z.string(),
  materialId: z.string(),
  order: z.number().int(),
});

export const removeMaterialFromListReturnSchema = z.object({
  id: z.string(),
});
