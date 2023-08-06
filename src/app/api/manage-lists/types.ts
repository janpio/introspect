import { z } from 'zod';

export const getManageListsReturnSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
  }),
);
