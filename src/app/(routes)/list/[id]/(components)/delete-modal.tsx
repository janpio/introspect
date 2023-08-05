'use client';
import { useToggle } from '@ethang/hooks/use-toggle';
import { useMutation } from '@tanstack/react-query';
import type { JSX } from 'react';

import { getLearningListKeys } from '../../../../../actions/get-learning-list/types';
import { removeMaterialFromList } from '../../../../../actions/remove-material-from-list/remove-material-from-list';
import { Button } from '../../../../(components)/(elements)/button';
import { Modal } from '../../../../(components)/modal';
import { queryClient } from '../../../../(components)/providers';

type DeleteModalProperties = {
  readonly listId: string;
  readonly materialId: string;
  readonly materialTitle: string;
  readonly order: number;
};

export function DeleteModal({
  listId,
  materialId,
  materialTitle,
  order,
}: DeleteModalProperties): JSX.Element {
  const [isOpen, toggleOpen] = useToggle(false);

  const { isLoading, mutate } = useMutation({
    async mutationFn() {
      await removeMaterialFromList(listId, materialId, order);

      await queryClient.invalidateQueries(getLearningListKeys(listId));
      toggleOpen();
    },
  });

  return (
    <div>
      <Button className="border-red-500 bg-red-500" onClick={toggleOpen}>
        Remove
      </Button>
      <Modal isOpen={isOpen} toggleOpen={toggleOpen}>
        <p>
          This will remove <span className="font-bold">{materialTitle}</span>{' '}
          from this list.
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
