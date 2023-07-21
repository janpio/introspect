import type { JSX } from 'react';
import React from 'react';
import { twMerge } from 'tailwind-merge';

type TextareaProperties = {
  readonly error?: string | null;
  readonly label: string;
  readonly name: string;
  readonly properties?: {
    container?: JSX.IntrinsicElements['div'];
    input?: JSX.IntrinsicElements['textarea'];
    label?: JSX.IntrinsicElements['label'];
  };
};

export function Textarea({
  error,
  label,
  name,
  properties,
}: TextareaProperties): JSX.Element {
  return (
    <div
      {...properties?.container}
      className={twMerge('my-4', properties?.container?.className)}
    >
      <label
        htmlFor={name}
        {...properties}
        className={twMerge(
          'block text-sm font-medium leading-6 text-gray-900',
          properties?.label?.className,
        )}
      >
        {label}
        <p>{error && <span className="text-red-500">{error}</span>}</p>
      </label>
      <div className="mt-2">
        <textarea
          id={name}
          name={name}
          rows={4}
          {...properties?.input}
          className={twMerge(
            'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
            properties?.input?.className,
            error && 'border-red-500 border-2',
          )}
        />
      </div>
    </div>
  );
}
