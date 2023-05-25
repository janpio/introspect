'use server';
import { currentUser } from '@clerk/nextjs';
import type { z } from 'zod';

import { ROOT_URL } from '../../../../util/constants';
import { zodFetch } from '../../../../util/zod';
import { learningListReturnSchema } from '../../../api/learning-list/types';

type GetListDataReturn = Promise<{
  data: z.output<typeof learningListReturnSchema>;
  user: Awaited<ReturnType<typeof currentUser>>;
}>;

export const getListData = async (listId: string): GetListDataReturn => {
  const user = await currentUser();

  const parameters = new URLSearchParams({
    listId,
  });
  if (user?.id) {
    parameters.append('clerkId', user.id);
  }

  const data = await zodFetch(
    learningListReturnSchema,
    `${ROOT_URL}/api/learning-list?${parameters.toString()}`,
    {
      credentials: 'same-origin',
      next: {
        revalidate: 86_400,
        tags: ['learningList'],
      },
    },
  );

  return { data, user };
};
