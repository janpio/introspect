import { z } from 'zod';

export const updateListOrderBodySchema = z.object({
  list: z.array(z.object({ id: z.string() })),
  listId: z.string(),
});
