import { z } from 'zod';

export const getManageListsKeys = ['get-manage-lists'];

export const getManageListsReturnSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
  }),
);
