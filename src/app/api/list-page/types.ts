import { z } from 'zod';

export const listPageTags = (): [string] => {
  return ['list-page'];
};

export const listPageReturnSchema = z.array(
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
  { invalid_type_error: 'listPageReturnSchema' },
);
