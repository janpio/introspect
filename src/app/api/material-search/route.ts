import { constants } from 'node:http2';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { isAuthenticated } from '../../../util/clerk';
import {
  LEARNING_MATERIAL_INDEX,
  type LearningMaterialSearchDocument,
  meilisearch,
} from '../../../util/meilisearch';

export async function GET(request: NextRequest): Promise<NextResponse> {
  if ((await isAuthenticated()) === null) {
    return NextResponse.json(
      { error: 'Unauthenticated' },
      { status: constants.HTTP_STATUS_UNAUTHORIZED },
    );
  }

  const search = request.nextUrl.searchParams.get('search');
  const data = await meilisearch()
    .index(LEARNING_MATERIAL_INDEX)
    .search<LearningMaterialSearchDocument>(search, { limit: 5 });

  return NextResponse.json(data);
}
