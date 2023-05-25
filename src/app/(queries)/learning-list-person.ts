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
