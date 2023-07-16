'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ROOT_URL } from '../../../../util/constants';
import { listPageTags, manageListsTags } from '../../../../util/tags';
import { zodFetch } from '../../../../util/zod';
import { Button } from '../../../(components)/(elements)/button';
import { Input } from '../../../(components)/(elements)/input';
import { queryClient } from '../../../(components)/providers';
import { createListReturnSchema } from '../../../api/create-list/types';

type CreateListFormProperties = {
  clerkId: string;
};

const formSchema = z.object({
  name: z.string().trim().min(1),
});

export function CreateListForm({
  clerkId,
}: CreateListFormProperties): JSX.Element {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: '' },
    resolver: zodResolver(formSchema),
  });

  const { isLoading, mutate } = useMutation({
    async mutationFn(data: { name: string }) {
      await zodFetch(createListReturnSchema, `${ROOT_URL}/api/create-list`, {
        body: JSON.stringify({
          ...data,
          clerkId,
        }),
        credentials: 'same-origin',
        method: 'POST',
      });

      await Promise.all([
        queryClient.invalidateQueries(manageListsTags(clerkId)),
        queryClient.invalidateQueries(listPageTags()),
      ]);

      reset();
    },
  });

  return (
    <form
      onSubmit={handleSubmit(data => {
        return mutate(data);
      })}
    >
      <fieldset disabled={isLoading}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Input
            isLabelHidden
            label="Name"
            name="name"
            properties={{
              input: { placeholder: 'Web Dev 101', ...register('name') },
            }}
          />
          <Button className="mt-2" type="submit">
            Create New List
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
