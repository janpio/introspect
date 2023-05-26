import { z } from 'zod';

export const createListBodySchema = z.object(
  {
    courses: z.array(
      z.object({
        courseName: z.string(),
        instructors: z.array(z.string()),
        links: z.array(z.string()),
        order: z.number(),
        publisherName: z.string(),
      }),
    ),
    name: z.string(),
    user: z.object({
      clerkId: z.string(),
      profileImage: z.string().optional(),
      username: z.string().optional(),
    }),
  },
  { invalid_type_error: 'createListBodySchema' },
);

export const createListReturnSchema = z.object(
  {
    id: z.string(),
  },
  { invalid_type_error: 'createListReturnSchema' },
);
