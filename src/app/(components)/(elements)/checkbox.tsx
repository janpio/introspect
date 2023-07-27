import { isEmpty } from 'lodash';
import type { JSX } from 'react';
import { twMerge } from 'tailwind-merge';

type CheckboxProperties = {
  readonly error?: string | null;
  readonly label: string;
  readonly name: string;
  readonly properties?: {
    container?: JSX.IntrinsicElements['div'];
    input?: JSX.IntrinsicElements['input'];
    label?: JSX.IntrinsicElements['label'];
  };
};

export function Checkbox({
  label,
  name,
  properties,
  error,
}: CheckboxProperties): JSX.Element {
  return (
    <div
      {...properties?.container}
      className={twMerge('my-4', properties?.container?.className)}
    >
      <label
        htmlFor={name}
        {...properties?.label}
        className={twMerge(
          'cursor-pointer text-gray-900 flex items-center gap-2',
          properties?.label?.className,
        )}
      >
        <div>
          <input
            id={name}
            name={name}
            type="checkbox"
            {...properties?.input}
            className={twMerge(
              'cursor-pointer h-4 w-4 rounded border-gray-300 text-blue-700 focus:ring-blue-700',
              properties?.input?.className,
              !isEmpty(error) && 'border-red-500',
            )}
          />
        </div>
        <div>
          <p className="h-5">{label}</p>
          <p>
            {!isEmpty(error) && <span className="text-red-500">{error}</span>}
          </p>
        </div>
      </label>
    </div>
  );
}
