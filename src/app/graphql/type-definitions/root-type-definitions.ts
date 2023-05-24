import { gql } from '@apollo/client';

export const rootTypeDefinitions = gql`
  scalar Date
  scalar DateTime
  scalar JSON

  type Query {
    learningList(where: LearningListWhereUniqueInput!): LearningList
    learningLists(
      where: LearningListWhereInput
      orderBy: [LearningListOrderByWithRelationInput]
      cursor: LearningListWhereUniqueInput
      take: Int
      skip: Int
      distinct: [LearningListScalarFieldEnum]
    ): [LearningList]
    person(where: PersonWhereUniqueInput!): Person
    persons(where: PersonWhereInput): [Person]
  }
`;
