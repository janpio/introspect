import {
  learningListMaterial,
  learningListMaterialRelationships,
  learningListMaterials,
} from './learning-list-material-query';
import {
  learningList,
  learningListRelationships,
  learningLists,
} from './learning-list-query';
import {
  learningMaterial,
  learningMaterialRelationships,
  learningMaterials,
} from './learning-material-query';
import { person, persons } from './person-query';

export const rootResolver = {
  LearningList: learningListRelationships,
  LearningListMaterial: learningListMaterialRelationships,
  LearningMaterial: learningMaterialRelationships,
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
