import { gql } from '@apollo/client';

export type LearningListFragmentReturn = {
  learningLists: Array<{
    createdAt: string;
    createrId: string;
    creator: {
      profileImageUrl: string;
      username: string;
    };
    id: string;
    name: string;
    updatedAt: string;
  }>;
};

const learningListFragment = gql`
  fragment learningListFragment on LearningList {
    createdAt
    createrId
    creator {
      profileImageUrl
      username
    }
    id
    name
    updatedAt
  }
`;

export const listPageQuery = gql`
  ${learningListFragment}

  query LearningLists {
    learningLists {
      ...learningListFragment
    }
  }
`;

export const manageQuery = gql`
  ${learningListFragment}

  query Manage($where: LearningListWhereInput) {
    learningLists(where: $where) {
      ...learningListFragment
    }
  }
`;

export type LearningListQueryReturn = {
  learningList?: {
    createdAt: string;
    createrId: string;
    creator: {
      clerkId: string;
      profileImageUrl: string;
      username: string;
    };
    id: string;
    learningListMaterials: Array<{
      id: string;
      learningListMaterialId: string;
      learningMaterial: {
        completedBy?: Array<{
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

export const learningListQuery = gql`
  ${learningListFragment}

  query LearningList(
    $learningListWhere: LearningListWhereUniqueInput!
    $userWhere: PersonWhereUniqueInput
    $isLoggedIn: Boolean!
  ) {
    learningList(where: $learningListWhere) {
      ...learningListFragment
      creator {
        clerkId
      }
      learningListMaterials(orderBy: { order: asc }) {
        learningMaterialId
        learningMaterial {
          completedBy(where: $userWhere) @include(if: $isLoggedIn) {
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
    }
  }
`;
