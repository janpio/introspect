'use client';
import { useToggle } from '@ethang/hooks/use-toggle';
import { StarIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import { isNil } from 'lodash';
import { useRouter } from 'next/navigation';
import type { JSX } from 'react';
import { useState } from 'react';

import { favoriteList } from '../(actions)/favorite';

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
  const router = useRouter();
  const [isLoading, toggleLoading] = useToggle(false);
  const [isFavorite, toggleFavorite] = useToggle(hasUserFavorited);
  const [clientCount, setClientCount] = useState(favoritedCount ?? 0);

  const handleFavorite = async (): Promise<void> => {
    if (!isNil(clerkId) && !isLoading) {
      toggleLoading();
      toggleFavorite();
      setClientCount(clientCount_ => {
        return isFavorite ? clientCount_ - 1 : clientCount_ + 1;
      });
      await favoriteList(clerkId, listId, hasUserFavorited);
      router.refresh();

      setTimeout(toggleLoading, 3000);
    }
  };

  return (
    <button disabled={isLoading} type="button" onClick={handleFavorite}>
      <StarIcon
        className={classNames('h-14 w-14', {
          'text-amber-400': isFavorite,
          'text-gray-400': !isFavorite,
        })}
      />
      <div className="text-center">({clientCount})</div>
    </button>
  );
}
