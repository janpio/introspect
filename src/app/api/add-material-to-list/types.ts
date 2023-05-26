import { z } from 'zod';

export const addMaterialToListBodySchema = z.object({
  instructors: z.array(z.string()),
  links: z.array(z.string()),
  listId: z.string(),
  listLength: z.number().int(),
  name: z.string(),
  publisherName: z.string(),
});

export const addMaterialToListReturnSchema = z.object({
  id: z.string(),
});
