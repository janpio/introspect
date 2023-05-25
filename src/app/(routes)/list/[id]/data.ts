'use server';
import { currentUser } from '@clerk/nextjs';

import {
  learningListQuery,
  type LearningListQueryReturn,
} from '../../../(queries)/learning-list';
import { defaultQueryOptions } from '../../../graphql/util/apollo';
import { getClient } from '../../../layout';

type GetListDataReturn = Promise<{
  data: LearningListQueryReturn;
  user: Awaited<ReturnType<typeof currentUser>>;
}>;

export const getListData = async (listId: string): GetListDataReturn => {
  const user = await currentUser();

  const { data } = await getClient().query<LearningListQueryReturn>({
    ...defaultQueryOptions,
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
