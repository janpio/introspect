import type { JSX, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonProperties = JSX.IntrinsicElements['button'] & {
  readonly children: ReactNode;
};

export function Button({ children, ...rest }: ButtonProperties): JSX.Element {
  return (
    <button
      type="button"
      {...rest}
      className={twMerge(
        'cursor-pointer rounded-lg border-2 border-blue-800 bg-blue-800 px-1 py-0.5 font-semibold text-white shadow-md',
        'disabled:bg-gray-500 disabled:border-gray-500 disabled:cursor-default',
        rest.className,
      )}
    >
      {children}
    </button>
  );
}
