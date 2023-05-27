import { z } from 'zod';

export const updateListOrderBodySchema = z.object(
  {
    list: z.array(z.object({ id: z.string() })),
    listId: z.string(),
  },
  { invalid_type_error: 'updateListOrderBodySchema' },
);

export const updateListOrderReturnSchema = z.array(
  z.object({
    id: z.string(),
  }),
  { invalid_type_error: 'updateListOrderReturnSchema' },
);
