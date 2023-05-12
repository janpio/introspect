import classNames from 'classnames';
import type { JSX, ReactNode } from 'react';

type ButtonProperties = {
  children: ReactNode;
  className?: string;
};

export function Button({ children, className }: ButtonProperties): JSX.Element {
  return (
    <button
      type="button"
      className={classNames(
        'cursor-pointer rounded-lg border-2 border-blue-800 bg-blue-800 p-2 font-semibold text-white shadow-md',
        className,
      )}
    >
      {children}
    </button>
  );
}
