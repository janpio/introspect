'use server';
import { createListSchema } from './schema';

export const createList = async (data: FormData): Promise<void> => {
  let jsonObject = {};
  for (const [key, value] of data.entries()) {
    jsonObject = {
      ...jsonObject,
      [key]: value,
    };
  }

  const listData = createListSchema.parse(jsonObject);

  console.info(listData);
};
