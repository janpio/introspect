import { z } from 'zod';

export const createListBodySchema = z.object(
  {
    clerkId: z.string(),
    name: z.string(),
  },
  { invalid_type_error: 'createListBodySchema' },
);

export const createListReturnSchema = z.object(
  {
    id: z.string(),
  },
  { invalid_type_error: 'createListReturnSchema' },
);
