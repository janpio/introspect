import { z } from 'zod';

export const updateListOrderBodySchema = z.object({
  listId: z.string(),
  materialACurrentOrder: z.number(),
  materialAId: z.string(),
  materialBCurrentOrder: z.number(),
  materialBId: z.string(),
});

export type UpdateListOrderBody = z.output<typeof updateListOrderBodySchema>;
