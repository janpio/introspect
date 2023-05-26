'use client';
import { useToggle } from '@ethang/hooks/use-toggle';
import { useRouter } from 'next/navigation';
import type { JSX } from 'react';

import { ROOT_URL } from '../../../../../util/constants';
import { zodFetch } from '../../../../../util/zod';
import { Button } from '../../../../(components)/(elements)/button';
import { Modal } from '../../../../(components)/modal';
import { removeMaterialFromListReturnSchema } from '../../../../api/remove-material-from-list/types';

type DeleteModalProperties = {
  listId: string;
  materialId: string;
  materialTitle: string;
  order: number;
};

export function DeleteModal({
  listId,
  materialId,
  materialTitle,
  order,
}: DeleteModalProperties): JSX.Element {
  const router = useRouter();
  const [isLoading, toggleLoading] = useToggle(false);
  const [isOpen, toggleOpen] = useToggle(false);

  const handleRemove = async (): Promise<void> => {
    toggleLoading();
    await zodFetch(
      removeMaterialFromListReturnSchema,
      `${ROOT_URL}/api/remove-material-from-list`,
      {
        body: JSON.stringify({ listId, materialId, order }),
        credentials: 'same-origin',
        method: 'POST',
      },
    );
    router.refresh();
    toggleLoading();
    toggleOpen();
  };

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
          <Button disabled={isLoading} onClick={handleRemove}>
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
