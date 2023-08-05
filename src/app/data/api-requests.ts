import { isNil } from 'lodash';

import {
  DEFAULT_CACHE_TIME,
  DEFAULT_STALE_TIME,
  ROOT_URL,
} from '../../util/constants';

export const DEFAULT_RQ_OPTIONS = {
  cacheTime: DEFAULT_CACHE_TIME,
  staleTime: DEFAULT_STALE_TIME,
  suspense: true,
};

export const getRequestKey = (request: Request): string[] => {
  let keys = [request.method, request.url];
  const varyHeader = request.headers.get('Vary');

  if (varyHeader !== null) {
    keys = [...keys, varyHeader];
  }

  return keys;
};

export const apiRequests = {
  getLearningList(listId: string, userId: string | null | undefined): Request {
    const parameters = new URLSearchParams({
      listId,
    });

    if (!isNil(userId)) {
      parameters.append('clerkId', userId);
    }

    return new Request(
      `${ROOT_URL}/api/learning-list?${parameters.toString()}`,
      {
        credentials: 'same-origin',
      },
    );
  },
  getListCard(listId: string, userId: string | null | undefined): Request {
    const searchParameters = new URLSearchParams({
      listId,
    });

    if (!isNil(userId)) {
      searchParameters.append('clerkId', userId);
    }

    return new Request(
      `${ROOT_URL}/api/list-card?${searchParameters.toString()}`,
      {
        credentials: 'same-origin',
      },
    );
  },
  getListPage(): Request {
    return new Request(`${ROOT_URL}/api/list-page`, {
      credentials: 'same-origin',
    });
  },
  getManageLists(userId: string): Request {
    const searchParameters = new URLSearchParams({
      clerkId: userId,
    });

    return new Request(
      `${ROOT_URL}/api/manage-lists?${searchParameters.toString()}`,
      {
        credentials: 'same-origin',
      },
    );
  },
};
