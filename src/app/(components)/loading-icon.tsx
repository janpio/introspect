import 'react-loading-skeleton/dist/skeleton.css';

import { JSX } from 'react';
import Skeleton from 'react-loading-skeleton';
import { twMerge } from 'tailwind-merge';

type LoadingIconProperties = {
  readonly className?: string;
  readonly count: number;
};

export function LoadingIcon({
  count,
  className,
}: LoadingIconProperties): JSX.Element {
  return (
    <div className={twMerge('w-full max-w-5xl mx-auto my-2 h-32', className)}>
      <Skeleton count={count} />
    </div>
  );
}
