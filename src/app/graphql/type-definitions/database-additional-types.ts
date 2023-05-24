import { gql } from '@apollo/client';

export const databaseAdditionalTypes = gql`
  type LearningListCountOutputTypeSelect {
    favoritedBy: Int
    learningListMaterial: Int
  }
`;
