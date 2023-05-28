import { DateTime } from 'luxon';
import type { JSX } from 'react';

import { ListCard } from '../../../(components)/list-card';
import { CardList } from './(components)/card-list';
import { CreateModal } from './(components)/create-modal';
import { getListData } from './data';

type ListPageProperties = {
  params: {
    id: string;
  };
};

export default async function ListPage({
  params,
}: ListPageProperties): Promise<JSX.Element | null> {
  const { user, data } = await getListData(params.id);

  if (!data) {
    return null;
  }

  const isOwnedByCurrent = user?.id === data.creator.clerkId;

  return (
    <div className="grid place-items-center">
      {/* @ts-expect-error Component returns promise */}
      <ListCard
        creatorProfileImage={data.creator.profileImageUrl}
        creatorUsername={data.creator.username}
        listCreatedAt={DateTime.fromISO(data.createdAt).toRelative()}
        listId={data.id}
        listName={data.name}
        listUpdatedAt={DateTime.fromISO(data.updatedAt).toRelative()}
      />
      <CardList
        isOwnedByCurrent={isOwnedByCurrent}
        list={data}
        user={{
          id: user?.id,
          imageUrl: user?.imageUrl,
          username: user?.username,
        }}
      />
      <div className="mx-auto my-4 max-w-5xl">
        {isOwnedByCurrent && (
          <CreateModal
            listId={data.id}
            listLength={data.learningListMaterial.length}
            user={{
              id: user.id,
              profileImageUrl: user.imageUrl,
              username: user.username,
            }}
          />
        )}
      </div>
    </div>
  );
}
