import { useEffect, useState } from 'react';
import { z, ZodSchema } from 'zod';

import { zodFetcher } from './zod';

type FetcherOptions = {
  cacheInterval?: number;
  request: Request;
};

type UseFetchReturn<DataType extends ZodSchema> = {
  data: z.output<DataType> | undefined;
  error: unknown;
  isLoading: boolean;
};

export const useFetch = <SchemaType extends ZodSchema>(
  schema: SchemaType,
  options: FetcherOptions,
): UseFetchReturn<SchemaType> => {
  const requestKey = `${options.request.url}${options.request.headers.get(
    'Vary',
  )}${options.request.method}`;
  const [data, setData] = useState<z.output<typeof schema>>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    zodFetcher(schema, options)
      .then(data => {
        setData(data);
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey]);

  return { data, error, isLoading };
};
