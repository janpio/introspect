import { AddMaterialToListBody } from './learning-list/types';
import { UpdateListOrderBody } from './update-list-order/types';
import { UpdateMaterialBody } from './update-material/types';

const ROOT_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://introspect.dev';

export const DEFAULT_CACHE_TIME = 1000 * 60 * 60 * 24;
export const DEFAULT_STALE_TIME = 1000 * 60 * 60 * 24;

export const DEFAULT_RQ_OPTIONS = {
  cacheTime: DEFAULT_CACHE_TIME,
  staleTime: DEFAULT_STALE_TIME,
  suspense: true,
};

export function getRequestKey(request: Request): string[] {
  let keys = [request.method, request.url];
  const varyHeader = request.headers.get('Vary');

  if (varyHeader !== null) {
    keys = [...keys, varyHeader];
  }

  return keys;
}

export const api = {
  addMaterialToList(body: AddMaterialToListBody): Request {
    return new Request(`${ROOT_URL}/api/learning-list`, {
      body: JSON.stringify(body),
      method: 'PATCH',
    });
  },
  createList(name: string): Request {
    return new Request(`${ROOT_URL}/api/learning-list`, {
      body: JSON.stringify({ name }),
      method: 'POST',
    });
  },
  deleteList(listId: string): Request {
    return new Request(`${ROOT_URL}/api/learning-list`, {
      body: JSON.stringify({ listId }),
      method: 'DELETE',
    });
  },
  favoriteList(listId: string, isAdding: boolean): Request {
    return new Request(`${ROOT_URL}/api/favorite-list`, {
      body: JSON.stringify({ isAdding, listId }),
      method: 'POST',
    });
  },
  getList(listId: string, userId?: string): Request {
    const searchParameters = new URLSearchParams({ listId });

    if (userId !== undefined) {
      searchParameters.append('userId', userId);
    }

    return new Request(
      `${ROOT_URL}/api/learning-list?${searchParameters.toString()}`,
    );
  },
  getListCard(listId: string, userId?: string): Request {
    const searchParameters = new URLSearchParams({ listId });

    if (userId !== undefined) {
      searchParameters.append('userId', userId);
    }

    return new Request(
      `${ROOT_URL}/api/list-card?${searchParameters.toString()}`,
    );
  },
  getListPage(): Request {
    return new Request(`${ROOT_URL}/api/list-page`);
  },
  getManageLists(): Request {
    return new Request(`${ROOT_URL}/api/manage-lists`);
  },
  removeMaterialFromList(
    listId: string,
    materialId: string,
    order: number,
  ): Request {
    return new Request(`${ROOT_URL}/api/remove-material-from-list`, {
      body: JSON.stringify({
        listId,
        materialId,
        order,
      }),
      method: 'POST',
    });
  },
  updateListOrder(body: UpdateListOrderBody): Request {
    return new Request(`${ROOT_URL}/api/update-list-order`, {
      body: JSON.stringify(body),
      method: 'POST',
    });
  },
  updateMaterial(body: UpdateMaterialBody): Request {
    return new Request(`${ROOT_URL}/api/update-material`, {
      body: JSON.stringify(body),
      method: 'POST',
    });
  },
  updateMaterialCompletion(materialId: string, complete: boolean): Request {
    return new Request(`${ROOT_URL}/api/update-material-completion`, {
      body: JSON.stringify({ complete, materialId }),
      method: 'POST',
    });
  },
};
