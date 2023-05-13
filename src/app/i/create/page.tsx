import { currentUser } from '@clerk/nextjs';
import type { JSX } from 'react';
import React from 'react';

import { MainForm } from './(components)/main-form';

export default async function Create(): Promise<JSX.Element> {
  const user = await currentUser();

  return (
    <div className="mx-auto my-4 max-w-7xl">
      <MainForm
        user={{
          id: user?.id,
          profileImageUrl: user?.profileImageUrl,
          username: user?.username,
        }}
      />
    </div>
  );
}
