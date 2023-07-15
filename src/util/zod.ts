import type { z, ZodSchema } from 'zod';

export async function zodFetch<SchemaType extends ZodSchema>(
  schema: SchemaType,
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<z.output<SchemaType>> {
  const response = await fetch(input, init);

  return schema.parse(await response.json());
}
