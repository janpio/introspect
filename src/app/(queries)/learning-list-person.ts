import { gql } from '@apollo/client';

export type ListCardQueryReturn = {
  learningList: {
    _count: {
      favoritedBy: number;
    };
  };
  person?: {
    clerkId: string;
    favoriteLists: Array<{ id: string }>;
    id: string;
  };
};

// variables: {
//       favoriteListsWhere: {
//         id: { equals: listId },
//       },
//       learningListWhere: {
//         id: listId,
//       },
//       personWhere: {
//         clerkId: clerkUser?.id,
//       },
//     }

export const listCardQuery = gql`
  query ListCardQuery(
    $learningListWhere: LearningListWhereUniqueInput!
    $personWhere: PersonWhereUniqueInput!
    $favoriteListsWhere: LearningListWhereInput
  ) {
    learningList(where: $learningListWhere) {
      createrId
      _count {
        favoritedBy
      }
    }
    person(where: $personWhere) {
      id
      clerkId
      favoriteLists(where: $favoriteListsWhere) {
        id
      }
    }
  }
`;
