import { Switch } from '@headlessui/react';
import type { JSX } from 'react';
import { twMerge } from 'tailwind-merge';

type ToggleProperties = {
  readonly isChecked: boolean;
  readonly label: string;
  readonly toggleChecked: () => void;
};

export function Toggle({
  isChecked,
  toggleChecked,
  label,
}: ToggleProperties): JSX.Element {
  return (
    <Switch.Group
      as="div"
      className={twMerge('my-4 flex gap-2 items-center justify-between')}
    >
      <span className="flex grow flex-col">
        <Switch.Label as="span" className="font-bold text-gray-900">
          {label}
        </Switch.Label>
      </span>
      <Switch
        checked={isChecked}
        className={twMerge(
          isChecked ? 'bg-blue-600' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
        )}
        onChange={toggleChecked}
      >
        <span
          aria-hidden="true"
          className={twMerge(
            isChecked ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out',
          )}
        />
      </Switch>
    </Switch.Group>
  );
}
