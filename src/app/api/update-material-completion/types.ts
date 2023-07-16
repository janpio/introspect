import { z } from 'zod';

export const updateMaterialCompletionBody = z.object(
  {
    clerkId: z.string(),
    complete: z.boolean(),
    materialId: z.string(),
  },
  { invalid_type_error: 'updateMaterialCompletionBody' },
);

export const updateMaterialCompletionReturn = z.object(
  {
    id: z.string(),
  },
  { invalid_type_error: 'updateMaterialCompletionReturn' },
);
