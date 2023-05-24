import { gql } from '@apollo/client';

export const databaseInputTypeDefinitions = gql`
  enum LearningListScalarFieldEnum {
    id
    createdAt
    updatedAt
    name
    createrId
  }

  enum SortOrder {
    ASC
    DESC
  }

  input DateTimeFilter {
    equals: Date
    in: [Date]
    notIn: [Date]
    lt: Date
    lte: Date
    gt: Date
    gte: Date
    not: DateTimeFilter
  }

  input LearningListMaterialListRelationFilter {
    every: LearningListMaterialWhereInput
    some: LearningListMaterialWhereInput
    none: LearningListMaterialWhereInput
  }

  input LearningListRelationFilter {
    is: LearningListWhereInput
    isNot: LearningListWhereInput
  }

  input LearningListWhereInput {
    AND: [LearningListWhereInput]
    OR: [LearningListWhereInput]
    NOT: [LearningListWhereInput]
    id: StringFilter
    createdAt: DateTimeFilter
    updatedAt: DateTimeFilter
    name: StringFilter
    createrId: StringFilter
    creator: PersonRelationFilter
    favoritedBy: PersonListRelationFilter
    learningListMaterial: LearningListMaterialListRelationFilter
  }

  input LearningListWhereUniqueInput {
    id: String
  }

  input LearningListMaterialWhereInput {
    AND: [LearningListMaterialWhereInput]
    OR: [LearningListMaterialWhereInput]
    NOT: [LearningListMaterialWhereInput]
    id: StringFilter
    createdAt: DateTimeFilter
    updatedAt: DateTimeFilter
    order: IntFilter
    learningListId: StringFilter
    learningMaterialId: StringFilter
    learningList: LearningListRelationFilter
    learningMaterial: LearningMaterialRelationFilter
  }

  input LearningListListRelationFilter {
    every: LearningListWhereInput
    some: LearningListWhereInput
    none: LearningListWhereInput
  }

  input LearningListOrderByWithRelationInput {
    id: SortOrder
    createdAt: SortOrder
    updatedAt: SortOrder
    name: SortOrder
    createrId: SortOrder
    creator: PersonOrderByWithRelationInput
    favoritedBy: OrderByRelationAggregateInput
    learningListMaterial: OrderByRelationAggregateInput
  }

  input LearningMaterialLinkListRelationFilter {
    every: LearningMaterialLinkWhereInput
    some: LearningMaterialLinkWhereInput
    none: LearningMaterialLinkWhereInput
  }

  input LearningMaterialLinkWhereInput {
    AND: [LearningMaterialLinkWhereInput]
    OR: [LearningMaterialLinkWhereInput]
    NOT: [LearningMaterialLinkWhereInput]
    id: StringFilter
    createdAt: DateTimeFilter
    updatedAt: DateTimeFilter
    url: StringFilter
    learningMaterialId: StringFilter
    learningMaterial: LearningMaterialRelationFilter
  }

  input LearningMaterialRelationFilter {
    is: LearningMaterialWhereInput
    isNot: LearningMaterialWhereInput
  }

  input LearningMaterialWhereInput {
    AND: [LearningMaterialWhereInput]
    OR: [LearningMaterialWhereInput]
    NOT: [LearningMaterialWhereInput]
    id: StringFilter
    createdAt: DateTimeFilter
    updatedAt: DateTimeFilter
    name: StringFilter
    publisherName: StringFilter
    instructors: StringNullableListFilter
    links: LearningMaterialLinkListRelationFilter
    learningListMaterial: LearningListMaterialListRelationFilter
  }

  input IntFilter {
    equals: Int
    in: [Int]
    notIn: [Int]
    lt: Int
    lte: Int
    gt: Int
    gte: Int
    not: IntFilter
  }

  input OrderByRelationAggregateInput {
    _count: SortOrder
  }

  input PersonRelationFilter {
    is: PersonWhereInput
    isNot: PersonWhereInput
  }

  input PersonListRelationFilter {
    every: PersonWhereInput
    some: PersonWhereInput
    none: PersonWhereInput
  }

  input PersonOrderByWithRelationInput {
    id: SortOrder
    createdAt: SortOrder
    updatedAt: SortOrder
    username: SortOrder
    profileImageUrl: SortOrder
    clerkId: SortOrder
    favoriteLists: OrderByRelationAggregateInput
    learningList: OrderByRelationAggregateInput
  }

  input PersonWhereInput {
    AND: [PersonWhereInput]
    OR: [PersonWhereInput]
    NOT: [PersonWhereInput]
    id: StringFilter
    createdAt: DateTimeFilter
    updatedAt: DateTimeFilter
    username: StringFilter
    profileImageUrl: StringFilter
    clerkId: StringFilter
    favoriteLists: LearningListListRelationFilter
    learningList: LearningListListRelationFilter
  }

  input PersonWhereUniqueInput {
    id: String
    username: String
    clerkId: String
  }

  input StringFilter {
    equals: String
    in: [String]
    notIn: [String]
    lt: String
    lte: String
    gt: String
    gte: String
    contains: String
    startsWith: String
    endsWith: String
    not: StringFilter
  }

  input StringNullableListFilter {
    equals: [String]
    has: String
    hasEvery: [String]
    hasSome: [String]
    isEmpty: Boolean
  }
`;
