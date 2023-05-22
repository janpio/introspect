import classNames from 'classnames';
import type { JSX } from 'react';

type CheckboxProperties = {
  error?: string | null;
  label: string;
  name: string;
  properties?: {
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
      className={classNames('my-4', properties?.container?.className)}
    >
      <label
        htmlFor={name}
        {...properties?.label}
        className={classNames(
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
            className={classNames(
              'cursor-pointer h-4 w-4 rounded border-gray-300 text-blue-700 focus:ring-blue-700',
              properties?.input?.className,
              {
                'border-red-500': error,
              },
            )}
          />
        </div>
        <div>
          <p className="h-5">{label}</p>
          <p>{error && <span className="text-red-500">{error}</span>}</p>
        </div>
      </label>
    </div>
  );
}
