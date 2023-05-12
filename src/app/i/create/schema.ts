import { z } from 'zod';

export const createListSchema = z.object({
  name: z.string(),
});
