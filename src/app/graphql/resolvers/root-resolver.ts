import {
  learningList,
  learningListRelationships,
  learningLists,
} from './learning-list-query';
import { person, persons } from './person-query';

export const rootResolver = {
  LearningList: learningListRelationships,
  Query: {
    learningList,
    learningLists,
    person,
    persons,
  },
};
