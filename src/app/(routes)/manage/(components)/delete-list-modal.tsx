'use client';
import { useUser } from '@clerk/nextjs';
import { useToggle } from '@ethang/hooks/use-toggle';
import { useMutation } from '@tanstack/react-query';
import type { JSX } from 'react';

import { Button } from '../../../(components)/(elements)/button';
import { Modal } from '../../../(components)/modal';
import { queryClient } from '../../../(components)/providers';
import { api } from '../../../data/api';
import { listPageTags, manageListsTags } from '../../../data/tags';

type DeleteListModalProperties = {
  readonly listId: string;
  readonly listTitle: string;
};

export function DeleteListModal({
  listId,
  listTitle,
}: DeleteListModalProperties): JSX.Element {
  const { user } = useUser();
  const [isOpen, toggleOpen] = useToggle(false);

  const { isLoading, mutate } = useMutation({
    async mutationFn() {
      await api.deleteList(listId);

      await Promise.all([
        queryClient.invalidateQueries(manageListsTags(user?.id ?? '')),
        queryClient.invalidateQueries(listPageTags()),
      ]);

      toggleOpen();
    },
  });

  return (
    <div className="flex justify-end">
      <Button className="border-red-500 bg-red-500" onClick={toggleOpen}>
        Remove
      </Button>
      <Modal isOpen={isOpen} toggleOpen={toggleOpen}>
        <p>
          This will <span className="font-bold">permanently delete</span>{' '}
          {listTitle}.
        </p>
        <p>Are you sure?</p>
        <div className="my-4 flex justify-between">
          <Button
            disabled={isLoading}
            onClick={(): void => {
              return mutate();
            }}
          >
            Yes, Remove
          </Button>
          <Button disabled={isLoading} onClick={toggleOpen}>
            No, Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
