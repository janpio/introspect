import { z } from 'zod';

export const createErrorBodySchema = z.object(
  {
    cause: z.unknown().optional(),
    message: z.string(),
    name: z.string(),
    stack: z.string().optional(),
  },
  { invalid_type_error: 'createErrorBodySchema' },
);

export const createErrorReturnSchema = z.object(
  {
    id: z.string(),
  },
  { invalid_type_error: 'createErrorReturnSchema' },
);
