import { z } from 'zod';

export const manageListsParametersSchema = z.object({
  clerkId: z.string(),
});

export const manageListsReturnSchema = z.array(
  z.object({
    createdAt: z.string().datetime(),
    creator: z.object({
      profileImageUrl: z.string(),
      username: z.string(),
    }),
    id: z.string(),
    name: z.string(),
    updatedAt: z.string().datetime(),
  }),
  { invalid_type_error: 'manageListsReturnSchema' },
);
