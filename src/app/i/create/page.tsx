import type { JSX } from 'react';

import { Input } from '../../(components)/(elements)/input';
import { createListSchema } from './schema';

export default function Create(): JSX.Element {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const createList = async (data: FormData): Promise<void> => {
    'use server';
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

  return (
    <div>
      <form action={createList} className="mx-auto my-4 max-w-xl">
        <fieldset>
          <Input label="Name" name="name" />
        </fieldset>
      </form>
    </div>
  );
}
