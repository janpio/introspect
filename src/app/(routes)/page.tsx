import type { JSX } from 'react';
import React from 'react';

import { ListCards } from '../(components)/(list-cards)/list-cards';

export default async function ListPage(): Promise<JSX.Element> {
  return (
    <>
      <h1 className="my-4 text-center text-3xl font-bold text-blue-900">
        Top Lists
      </h1>
      <div className="grid place-items-center gap-2">
        <ListCards />
      </div>
    </>
  );
}
