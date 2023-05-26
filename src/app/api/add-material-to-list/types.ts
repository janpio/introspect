import { z } from 'zod';

export const addMaterialToListBodySchema = z.object(
  {
    instructors: z.array(z.string()),
    links: z.array(z.string()),
    listId: z.string(),
    listLength: z.number().int(),
    name: z.string(),
    publisherName: z.string(),
  },
  { invalid_type_error: 'addMaterialToListBodySchema' },
);

export const addMaterialToListReturnSchema = z.object(
  {
    id: z.string(),
  },
  { invalid_type_error: 'addMaterialToListReturnSchema' },
);
