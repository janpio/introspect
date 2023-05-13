import { z } from 'zod';

export const createFavoriteSchema = z.object({
  clerkId: z.string(),
  hasUserFavorited: z.boolean(),
  listId: z.string(),
});
