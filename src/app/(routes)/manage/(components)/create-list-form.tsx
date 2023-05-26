'use client';
import { useToggle } from '@ethang/hooks/use-toggle';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import type { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ROOT_URL } from '../../../../util/constants';
import { zodFetch } from '../../../../util/zod';
import { Button } from '../../../(components)/(elements)/button';
import { Input } from '../../../(components)/(elements)/input';
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
  const router = useRouter();
  const [isLoading, toggleLoading] = useToggle(false);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: '' },
    resolver: zodResolver(formSchema),
  });

  const handleCreateList = async (data: { name: string }): Promise<void> => {
    toggleLoading();
    await zodFetch(createListReturnSchema, `${ROOT_URL}/api/create-list`, {
      body: JSON.stringify({
        ...data,
        clerkId,
      }),
      credentials: 'same-origin',
      method: 'POST',
    });

    reset();
    router.refresh();
    toggleLoading();
  };

  return (
    <form onSubmit={handleSubmit(handleCreateList)}>
      <fieldset disabled={isLoading}>
        <div className="mb-4 flex flex-wrap items-end gap-2">
          <Input
            isLabelHidden
            label="Name"
            name="name"
            properties={{
              container: { className: 'my-0' },
              input: { placeholder: 'Web Dev 101', ...register('name') },
            }}
          />
          <Button type="submit">Create New List</Button>
        </div>
      </fieldset>
    </form>
  );
}
