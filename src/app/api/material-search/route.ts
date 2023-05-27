import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
  LEARNING_MATERIAL_INDEX,
  type LearningMaterialSearchDocument,
  meilisearch,
} from '../../../util/meilisearch';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const search = request.nextUrl.searchParams.get('search');
  const data = await meilisearch()
    .index(LEARNING_MATERIAL_INDEX)
    .search<LearningMaterialSearchDocument>(search, { limit: 5 });

  return NextResponse.json(data);
}
