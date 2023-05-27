import { MeiliSearch } from 'meilisearch';

import { environment } from './environment';

export const LEARNING_MATERIAL_INDEX = 'introspect-learning-material';

export function meilisearch(): MeiliSearch {
  return new MeiliSearch({
    apiKey: environment.MEILISEARCH_SEARCH_KEY,
    host: environment.MEILISEARCH_HOST,
  });
}

export function meilisearchAdmin(): MeiliSearch {
  return new MeiliSearch({
    apiKey: environment.MEILISEARCH_ADMIN_KEY,
    host: environment.MEILISEARCH_HOST,
  });
}
