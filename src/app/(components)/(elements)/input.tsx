import type { JSX } from 'react';

type InputProperties = {
  label: string;
  name: string;
  properties?: {
    container?: JSX.IntrinsicElements['div'];
    input?: JSX.IntrinsicElements['input'];
    label?: JSX.IntrinsicElements['label'];
  };
  type?: string;
};

export function Input({
  label,
  name,
  type = 'text',
  properties,
}: InputProperties): JSX.Element {
  return (
    <div {...properties?.container}>
      <label
        className="block text-sm font-medium leading-6 text-gray-900"
        htmlFor={name}
        {...properties?.label}
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          id={name}
          name={name}
          type={type}
          {...properties?.input}
        />
      </div>
    </div>
  );
}
