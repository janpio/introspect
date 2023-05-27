import type { SearchParams, SearchResponse } from 'meilisearch';

import type { LearningMaterialSearchDocument } from '../../../util/meilisearch';

export type LearningMaterialSearchResponse = SearchResponse<
  LearningMaterialSearchDocument,
  SearchParams
>;
