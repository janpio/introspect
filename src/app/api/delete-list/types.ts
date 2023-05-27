import { z } from 'zod';

export const deleteListBodySchema = z.object({
  listId: z.string(),
});

export const deleteListReturnSchema = z.object({
  id: z.string(),
});
