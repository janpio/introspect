import { gql } from '@apollo/client';

export const databaseModelTypeDefinitions = gql`
  type LearningList {
    id: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String!
    createrId: String!
    creator: Person!
    favoritedBy: [Person]!
    learningListMaterials(
      orderBy: LearningListMaterialOrderByWithRelationInput
    ): [LearningListMaterial]!
    _count: LearningListCountOutputTypeSelect
  }

  type LearningListMaterial {
    id: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    order: Int!
    learningListId: String!
    learningList: LearningList!
    learningMaterialId: String!
    learningMaterial: LearningMaterial!
  }

  type LearningMaterial {
    id: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String!
    publisherName: String!
    completedBy(where: PersonWhereUniqueInput): [Person]!
    instructors: [String]!
    links: [LearningMaterialLink]!
    learningListMaterial: [LearningListMaterial]!
  }

  type LearningMaterialLink {
    id: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    url: String!
    learningMaterialId: String
    learningMaterial: LearningMaterial
  }

  type Person {
    id: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    username: String
    profileImageUrl: String
    clerkId: String!
    completedMaterial: [LearningMaterial]!
    favoriteLists: [LearningList]!
    learningList: [LearningList]!
  }
`;
