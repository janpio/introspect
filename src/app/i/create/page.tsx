import type { JSX } from 'react';
import React from 'react';

import { MainForm } from './(components)/main-form';

export default function Create(): JSX.Element {
  return (
    <div className="mx-auto my-4 max-w-7xl">
      <MainForm />
    </div>
  );
}
