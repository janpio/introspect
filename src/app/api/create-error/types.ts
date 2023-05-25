import { z } from 'zod';

export const createErrorBodySchema = z.object({
  cause: z.unknown().optional(),
  message: z.string(),
  name: z.string(),
  stack: z.string().optional(),
});

export const createErrorReturnSchema = z.object({
  id: z.string(),
});
