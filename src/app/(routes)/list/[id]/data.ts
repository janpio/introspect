'use server';
import { gql } from '@apollo/client';
import { currentUser } from '@clerk/nextjs';

import { getClient } from '../../../layout';

export type ListPageQuery = {
  learningList?: {
    createdAt: string;
    createrId: string;
    creator: {
      clerkId: string;
      profileImageUrl: string;
      username: string;
    };
    favoritedBy: Array<{
      id: string;
    }>;
    id: string;
    learningListMaterials: Array<{
      id: string;
      learningListMaterialId: string;
      learningMaterial: {
        completedBy: Array<{
          id: string;
        }>;
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
      createrId
      creator {
        clerkId
        profileImageUrl
        username
      }
      favoritedBy {
        id
      }
      id
      learningListMaterials {
        learningMaterialId
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
