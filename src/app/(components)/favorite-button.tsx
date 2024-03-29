'use client';
import { useToggle } from '@ethang/hooks/use-toggle';
import { StarIcon } from '@heroicons/react/24/solid';
import { useMutation } from '@tanstack/react-query';
import { isNil } from 'lodash';
import type { JSX } from 'react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { api, getRequestKey } from '../api/api';
import { queryClient } from './providers';

type FavoriteButtonProperties = {
  readonly clerkId?: string | null;
  readonly favoritedCount?: number;
  readonly hasUserFavorited: boolean;
  readonly listId: string;
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
      if (isNil(clerkId)) {
        return;
      }

      toggleFavorite();
      setClientCount(clientCount_ => {
        return isFavorite ? clientCount_ - 1 : clientCount_ + 1;
      });

      await fetch(api.favoriteList(listId, !isFavorite));
    },
    async onSuccess() {
      await queryClient.invalidateQueries(
        getRequestKey(api.getListCard(listId)),
      );
    },
  });

  return (
    <button
      className="grid place-items-center"
      disabled={isLoading || isNil(clerkId)}
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
