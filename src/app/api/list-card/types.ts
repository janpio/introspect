import { z } from 'zod';

export const listCardReturnSchema = z.tuple([
  z
    .object({
      _count: z.object({
        favoritedBy: z.number(),
      }),
    })
    .nullable(),
  z
    .object({
      favoriteLists: z.array(
        z.object({
          id: z.string(),
        }),
      ),
    })
    .nullable(),
]);
