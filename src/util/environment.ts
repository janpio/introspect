import { z } from 'zod';

export const environment = z
  .object({
    CLERK_PUBLISHABLE_KEY: z.string(),
    CLERK_SECRET_KEY: z.string(),
  })
  .parse(process.env);
