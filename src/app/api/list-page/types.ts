import { z } from 'zod';

export const listPageReturnSchema = z.array(
  z.object({
    id: z.string(),
  }),
  { invalid_type_error: 'listPageReturnSchema' },
);
