'use client';
import { useMousePosition } from '@ethang/hooks/use-mouse-position';
import { useToggle } from '@ethang/hooks/use-toggle';
import type { JSX } from 'react';

import { Button } from '../../../../(components)/(elements)/button';

export function EditModal(): JSX.Element {
  const { mouseY } = useMousePosition();
  const [isOpen, toggleOpen] = useToggle(false);

  return (
    <div>
      <p>{mouseY}</p>
      <Button onClick={toggleOpen}>Edit</Button>
      <dialog className="border-2 p-4" open={isOpen} style={{ top: mouseY }}>
        <p>Hello</p>
        <Button onClick={toggleOpen}>Save</Button>
      </dialog>
    </div>
  );
}
