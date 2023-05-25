'use server';
import { currentUser } from '@clerk/nextjs';

import {
  learningListQuery,
  type LearningListQueryReturn,
} from '../../../(queries)/learning-list';
import { getClient } from '../../../layout';

type GetListDataReturn = Promise<{
  data: LearningListQueryReturn;
  user: Awaited<ReturnType<typeof currentUser>>;
}>;

export const getListData = async (listId: string): GetListDataReturn => {
  const user = await currentUser();

  const { data } = await getClient().query<LearningListQueryReturn>({
    context: {
      fetchOptions: {
        next: { revalidate: 86_400, tags: ['learningListQuery'] },
      },
    },
    query: learningListQuery,
    variables: {
      isLoggedIn: typeof user?.id === 'string',
      learningListWhere: {
        id: listId,
      },
      userWhere: {
        clerkId: user?.id,
      },
    },
  });

  return { data, user };
};
