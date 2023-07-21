import type { JSX } from 'react';
import { twMerge } from 'tailwind-merge';

type InputProperties = {
  readonly error?: string | null;
  readonly isLabelHidden?: boolean;
  readonly label: string;
  readonly name: string;
  readonly properties?: {
    container?: JSX.IntrinsicElements['div'];
    input?: JSX.IntrinsicElements['input'];
    label?: JSX.IntrinsicElements['label'];
  };
  readonly type?: string;
};

export function Input({
  error,
  isLabelHidden,
  label,
  name,
  type = 'text',
  properties,
}: InputProperties): JSX.Element {
  return (
    <div
      {...properties?.container}
      className={twMerge('my-4', properties?.container?.className)}
    >
      {isLabelHidden !== true && (
        <label
          htmlFor={name}
          {...properties?.label}
          className={twMerge(
            'block text-sm font-medium leading-6 text-gray-900',
            properties?.label?.className,
          )}
        >
          {label}
          <p>{error && <span className="text-red-500">{error}</span>}</p>
        </label>
      )}
      <div className="mt-2">
        <input
          id={name}
          name={name}
          type={type}
          {...properties?.input}
          className={twMerge(
            'block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6',
            properties?.input?.className,
            error && 'border-red-500 border-2',
          )}
        />
      </div>
    </div>
  );
}
