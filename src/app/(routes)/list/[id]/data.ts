'use server';
import { gql } from '@apollo/client';
import { currentUser } from '@clerk/nextjs';

import { getClient } from '../../../layout';

type ListPageQuery = {
  learningList?: {
    createdAt: string;
    creator: {
      clerkId: string;
      profileImageUrl: string;
      username: string;
    };
    favoritedBy: {
      id: string;
    };
    id: string;
    learningListMaterial: Array<{
      learningMaterial: {
        completedBy: {
          id: string;
        };
        id: string;
        instructors: string[];
        links: Array<{
          id: string;
          url: string;
        }>;
        name: string;
        publisherName: string;
      };
      order: number;
    }>;
    name: string;
    updatedAt: string;
  };
};

const listPageQuery = gql`
  query LearningList(
    $learningListWhere: LearningListWhereUniqueInput!
    $userWhere: PersonWhereUniqueInput
  ) {
    learningList(where: $learningListWhere) {
      createdAt
      creator {
        clerkId
        profileImageUrl
        username
      }
      favoritedBy {
        id
      }
      id
      learningListMaterial {
        learningMaterial {
          completedBy(where: $userWhere) {
            id
          }
          instructors
          id
          links {
            id
            url
          }
          name
          publisherName
        }
        order
      }
      name
      updatedAt
    }
  }
`;

type GetListDataReturn = Promise<{
  data: ListPageQuery;
  user: Awaited<ReturnType<typeof currentUser>>;
}>;

export const getListData = async (listId: string): GetListDataReturn => {
  const user = await currentUser();

  const { data } = await getClient().query<ListPageQuery>({
    context: { fetchOptions: { next: { revalidate: 86_400 } } },
    query: listPageQuery,
    variables: {
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
