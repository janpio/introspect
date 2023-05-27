import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
  LEARNING_MATERIAL_INDEX,
  meilisearch,
} from '../../../util/meilisearch';
import type { LearningMaterialIndex } from './types';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const search = request.nextUrl.searchParams.get('search');
  const data = await meilisearch()
    .index(LEARNING_MATERIAL_INDEX)
    .search<LearningMaterialIndex>(search, { limit: 5 });

  return NextResponse.json(data);
}
