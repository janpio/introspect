import { z } from 'zod';

export const updateMaterialBodySchema = z.object(
  {
    courseName: z.string(),
    id: z.string(),
    instructors: z.array(z.string()),
    links: z.array(z.string()),
    listId: z.string(),
    publisherName: z.string(),
  },
  { invalid_type_error: 'updateMaterialBody' },
);

export const updateMaterialReturnSchema = z.object({ id: z.string() });
