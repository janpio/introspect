import { learningList, learningLists } from './learning-list-query';

export const rootResolver = {
  Query: {
    learningList,
    learningLists,
  },
};
