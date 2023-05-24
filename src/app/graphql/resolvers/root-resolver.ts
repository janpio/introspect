import { learningList, learningLists } from './learning-list-query';
import { person } from './person-query';

export const rootResolver = {
  Query: {
    learningList,
    learningLists,
    person,
  },
};
