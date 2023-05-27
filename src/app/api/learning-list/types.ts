import { z } from 'zod';

export const learningListReturnSchema = z
  .object(
    {
      createdAt: z.string().datetime(),
      creator: z.object({
        clerkId: z.string(),
        profileImageUrl: z.string(),
        username: z.string(),
      }),
      id: z.string(),
      learningListMaterial: z.array(
        z.object({
          id: z.string(),
          learningMaterial: z.object({
            completedBy: z.array(z.object({ id: z.string() })).optional(),
            id: z.string(),
            instructors: z.array(z.string()),
            links: z.array(z.object({ id: z.string(), url: z.string() })),
            name: z.string(),
            publisherName: z.string(),
          }),
          order: z.number().int(),
        }),
      ),
      name: z.string(),
      updatedAt: z.string().datetime(),
    },
    { invalid_type_error: 'learningListReturnSchema' },
  )
  .nullable();
