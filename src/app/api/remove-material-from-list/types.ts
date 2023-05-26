import { z } from 'zod';

export const removeMaterialFromListBodySchema = z.object(
  {
    listId: z.string(),
    materialId: z.string(),
    order: z.number().int(),
  },
  { invalid_type_error: 'removeMaterialFromListBodySchema' },
);

export const removeMaterialFromListReturnSchema = z.object(
  {
    id: z.string(),
  },
  { invalid_type_error: 'removeMaterialFromListReturnSchema' },
);
