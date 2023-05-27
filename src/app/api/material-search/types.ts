import type { SearchParams, SearchResponse } from 'meilisearch';

export type LearningMaterialIndex = {
  id: string;
  instructors: string[];
  name: string;
  publisherName: string;
};

export type LearningMaterialSearchResponse = SearchResponse<
  LearningMaterialIndex,
  SearchParams
>;
