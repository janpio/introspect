import { gql } from '@apollo/client';

export const rootTypeDefinitions = gql`
  scalar Date
  scalar DateTime
  scalar JSON

  type Mutation {
    favoriteList(
      clerkId: String
      isAdding: Boolean
      listId: String
    ): LearningList
  }

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
    learningListMaterial(
      where: LearningListMaterialWhereUniqueInput!
    ): LearningListMaterial
    learningListMaterials(
      where: LearningListMaterialWhereInput
      orderBy: LearningListMaterialOrderByWithRelationInput
    ): [LearningListMaterial]
    learningMaterial(where: LearningMaterialWhereUniqueInput!): LearningMaterial
    learningMaterials(where: LearningMaterialWhereInput): [LearningMaterial]
    person(where: PersonWhereUniqueInput!): Person
    persons(where: PersonWhereInput): [Person]
  }
`;
