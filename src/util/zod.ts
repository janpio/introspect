import { fetcher } from '@ethang/fetch';
import type { z, ZodSchema } from 'zod';

type FetcherOptions = {
  cacheInterval?: number;
  request: Request;
};

export async function zodFetch<SchemaType extends ZodSchema>(
  schema: SchemaType,
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<z.output<SchemaType>> {
  const response = await fetch(input, init);

  return schema.parse(await response.json());
}

export async function zodFetcher<SchemaType extends ZodSchema>(
  schema: SchemaType,
  options: FetcherOptions,
): Promise<z.output<SchemaType>> {
  const response = await fetcher(options);

  return schema.parse(await response?.json());
}
