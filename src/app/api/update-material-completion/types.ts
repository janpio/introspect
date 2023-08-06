import { z } from 'zod';

export const updateMaterialCompletionBodySchema = z.object({
  complete: z.boolean(),
  materialId: z.string(),
});
