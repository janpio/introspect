import { z } from 'zod';

export const environment = z
  .object({
    CLERK_SECRET_KEY: z.string(),
    MEILISEARCH_ADMIN_KEY: z.string(),
    MEILISEARCH_HOST: z.string(),
    MEILISEARCH_MASTER_KEY: z.string(),
    MEILISEARCH_SEARCH_KEY: z.string(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    NODE_ENV: z.string(),
  })
  .parse(process.env);
