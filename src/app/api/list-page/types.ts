import { z } from 'zod';

export const getListPageReturnSchema = z.array(
  z.object({
    id: z.string(),
  }),
);
