import { constants } from 'node:http2';

import { isNil } from 'lodash';
import { type NextRequest, NextResponse } from 'next/server';

import {
  LEARNING_MATERIAL_INDEX,
  meilisearch,
} from '../../../util/meilisearch';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const search = request.nextUrl.searchParams.get('search');

  if (isNil(search)) {
    return NextResponse.json(
      { error: 'Must provide search term.' },
      { status: constants.HTTP_STATUS_BAD_REQUEST },
    );
  }

  const client = meilisearch();
  const index = client.index(LEARNING_MATERIAL_INDEX);

  const results = await index.search(search);

  return NextResponse.json(results);
}
