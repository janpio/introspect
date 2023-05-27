'use client';
import { useToggle } from '@ethang/hooks/use-toggle';
import { StarIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import type { JSX } from 'react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { ROOT_URL } from '../../util/constants';

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
    if (clerkId) {
      toggleLoading();
      toggleFavorite();
      setClientCount(clientCount_ => {
        return isFavorite ? clientCount_ - 1 : clientCount_ + 1;
      });
      await fetch(`${ROOT_URL}/api/favorite-list`, {
        body: JSON.stringify({
          clerkId,
          isAdding: !isFavorite,
          listId,
        }),
        credentials: 'same-origin',
        method: 'POST',
      });
      router.refresh();
      toggleLoading();
    }
  };

  return (
    <button disabled={isLoading} type="button" onClick={handleFavorite}>
      <StarIcon
        className={twMerge(
          'h-14 w-14',
          isFavorite ? 'text-amber-400' : 'text-gray-400',
        )}
      />
      <div className="text-center">({clientCount})</div>
    </button>
  );
}
