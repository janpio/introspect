import { z } from 'zod';

export const favoriteListBodySchema = z.object({
  isAdding: z.boolean(),
  listId: z.string(),
});
