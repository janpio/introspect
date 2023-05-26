import { z } from 'zod';

export const deleteListBodySchema = z.object({
  clerkId: z.string(),
  listId: z.string(),
});

export const deleteListReturnSchema = z.object({
  id: z.string(),
});
