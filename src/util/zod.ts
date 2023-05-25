import type { ZodSchema } from 'zod';
import type { z } from 'zod';

export async function zodFetch<SchemaType extends ZodSchema>(
  schema: SchemaType,
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<z.output<SchemaType>> {
  const response = await fetch(input, init);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return schema.parse(await response.json());
}
