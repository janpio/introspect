import classNames from 'classnames';
import type { JSX } from 'react';
import React from 'react';

type TextareaProperties = {
  error?: string | null;
  label: string;
  name: string;
  properties?: {
    container?: JSX.IntrinsicElements['div'];
    input?: JSX.IntrinsicElements['textarea'];
    label?: JSX.IntrinsicElements['label'];
  };
  type?: string;
};

export function Textarea({
  error,
  label,
  name,
  properties,
  type,
}: TextareaProperties): JSX.Element {
  return (
    <div
      {...properties?.container}
      className={classNames('my-4', properties?.container?.className)}
    >
      <label
        htmlFor={name}
        {...properties}
        className={classNames(
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
          className={classNames(
            'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
            properties?.input?.className,
            {
              'border-red-500 border-2': error,
            },
          )}
        />
      </div>
    </div>
  );
}
