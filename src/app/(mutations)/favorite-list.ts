import { gql } from '@apollo/client';

export const favoriteList = gql`
  mutation favoriteList($clerkId: String, $isAdding: Boolean, $listId: String) {
    favoriteList(clerkId: $clerkId, isAdding: $isAdding, listId: $listId) {
      id
    }
  }
`;
