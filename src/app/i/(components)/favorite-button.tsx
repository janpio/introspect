'use client';
import { StarIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import { isNil } from 'lodash';
import type { JSX } from 'react';

type FavoriteButtonProperties = {
  clerkId?: string | null;
  favoritedCount?: number;
  hasUserFavorited: boolean;
  listId: string;
};

export function FavoriteButton({
  clerkId,
  hasUserFavorited,
  favoritedCount,
  listId,
}: FavoriteButtonProperties): JSX.Element {
  const handleFavorite = async (): Promise<void> => {
    if (!isNil(clerkId)) {
      await fetch('/i/favorite', {
        body: JSON.stringify({
          clerkId,
          hasUserFavorited,
          listId,
        }),
        method: 'POST',
      });
    }
  };

  return (
    <button type="button">
      <StarIcon
        className={classNames('h-14 w-14', {
          'text-amber-400': hasUserFavorited,
          'text-gray-400': !hasUserFavorited,
        })}
        onClick={handleFavorite}
      />
      <div className="text-center">({favoritedCount})</div>
    </button>
  );
}
