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
  const { user, list } = await getListData(params.id);

  if (!list) {
    return null;
  }

  const isOwnedByCurrent = user?.id === list.creator.clerkId;

  return (
    <div className="mx-auto my-4 grid max-w-7xl place-items-center">
      {/* @ts-expect-error Component returns promise */}
      <ListCard
        creatorProfileImage={list.creator.profileImageUrl}
        creatorUsername={list.creator.username}
        listCreatedAt={DateTime.fromJSDate(list.createdAt).toRelative()}
        listId={list.id}
        listName={list.name}
        listUpdatedAt={DateTime.fromJSDate(list.updatedAt).toRelative()}
      />
      <CardList isOwnedByCurrent={isOwnedByCurrent} list={list} user={user} />
      <div className="mx-auto my-4 max-w-5xl">
        {isOwnedByCurrent && (
          <CreateModal
            listId={list.id}
            listLength={list.learningListMaterial.length}
            user={{
              id: user.id,
              profileImageUrl: user.profileImageUrl,
              username: user.username,
            }}
          />
        )}
      </div>
    </div>
  );
}
