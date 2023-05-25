import { favoriteList } from './mutations/favorite-list-mutation';
import {
  learningListMaterial,
  learningListMaterialRelationships,
  learningListMaterials,
} from './queries/learning-list-material-query';
import {
  learningList,
  learningListRelationships,
  learningLists,
} from './queries/learning-list-query';
import {
  learningMaterial,
  learningMaterialRelationships,
  learningMaterials,
} from './queries/learning-material-query';
import { person, persons } from './queries/person-query';

export const rootResolver = {
  LearningList: learningListRelationships,
  LearningListMaterial: learningListMaterialRelationships,
  LearningMaterial: learningMaterialRelationships,
  Mutation: {
    favoriteList,
  },
  Query: {
    learningList,
    learningListMaterial,
    learningListMaterials,
    learningLists,
    learningMaterial,
    learningMaterials,
    person,
    persons,
  },
};
