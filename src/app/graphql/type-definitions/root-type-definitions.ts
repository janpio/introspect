import { gql } from '@apollo/client';

export const rootTypeDefinitions = gql`
  scalar Date
  scalar DateTime
  scalar JSON

  type Query {
    learningLists(
      where: LearningListWhereInput
      orderBy: [LearningListOrderByWithRelationInput]
      cursor: LearningListWhereUniqueInput
      take: Int
      skip: Int
      distinct: [LearningListScalarFieldEnum]
    ): [LearningList]
  }
`;
