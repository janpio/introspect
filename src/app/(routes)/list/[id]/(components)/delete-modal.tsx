'use client';
import { useToggle } from '@ethang/hooks/use-toggle';
import { useRouter } from 'next/navigation';
import type { JSX } from 'react';

import { removeMaterialFromList } from '../../../../(actions)/remove-material-from-list';
import { Button } from '../../../../(components)/(elements)/button';
import { Modal } from '../../../../(components)/modal';

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
  const [isOpen, toggleOpen] = useToggle(false);

  const handleRemove = async (): Promise<void> => {
    await removeMaterialFromList({ listId, materialId, order });
    router.refresh();
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
          <Button onClick={handleRemove}>Yes, Remove</Button>
          <Button onClick={toggleOpen}>No, Cancel</Button>
        </div>
      </Modal>
    </div>
  );
}
