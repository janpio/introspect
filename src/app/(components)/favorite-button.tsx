'use client';
import { useToggle } from '@ethang/hooks/use-toggle';
import { StarIcon } from '@heroicons/react/24/solid';
import { useMutation } from '@tanstack/react-query';
import type { JSX } from 'react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { ROOT_URL } from '../../util/constants';
import { listCardTags } from '../../util/tags';
import { queryClient } from './providers';

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
  const [isFavorite, toggleFavorite] = useToggle(hasUserFavorited);
  const [clientCount, setClientCount] = useState(favoritedCount ?? 0);

  const { isLoading, mutate } = useMutation({
    async mutationFn() {
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
    },
    async onSuccess() {
      await queryClient.invalidateQueries(listCardTags(listId));
    },
  });

  return (
    <button
      className="grid place-items-center"
      disabled={isLoading}
      type="button"
      onClick={(): void => {
        return mutate();
      }}
    >
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
