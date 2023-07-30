/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { isNil } from 'lodash';
import { z } from 'zod';

import { ROOT_URL } from '../../util/constants';
import { zodFetch } from '../../util/zod';
import {
  addMaterialToListBodySchema,
  addMaterialToListReturnSchema,
} from '../api/add-material-to-list/types';
import {
  createListBodySchema,
  createListReturnSchema,
} from '../api/create-list/types';
import { deleteListReturnSchema } from '../api/delete-list/types';
import {
  LearningListMaterialsFromQuery,
  learningListReturnSchema,
} from '../api/learning-list/types';
import { ListCardReturn } from '../api/list-card/types';
import { listPageReturnSchema } from '../api/list-page/types';
import { manageListsReturnSchema } from '../api/manage-lists/types';
import { removeMaterialFromListReturnSchema } from '../api/remove-material-from-list/types';
import { updateListOrderReturnSchema } from '../api/update-list-order/types';
import {
  updateMaterialBodySchema,
  updateMaterialReturnSchema,
} from '../api/update-material/types';
import { updateMaterialCompletionReturn } from '../api/update-material-completion/types';

export const api = {
  async addMaterialToList(data: z.output<typeof addMaterialToListBodySchema>) {
    return zodFetch(
      addMaterialToListReturnSchema,
      `${ROOT_URL}/api/add-material-to-list`,
      {
        body: JSON.stringify(data),
        credentials: 'same-origin',
        method: 'POST',
      },
    );
  },
  async createList(data: z.output<typeof createListBodySchema>) {
    return zodFetch(createListReturnSchema, `${ROOT_URL}/api/create-list`, {
      body: JSON.stringify(data),
      credentials: 'same-origin',
      method: 'POST',
    });
  },
  async deleteList(listId: string) {
    return zodFetch(deleteListReturnSchema, `${ROOT_URL}/api/delete-list`, {
      body: JSON.stringify({ listId }),
      credentials: 'same-origin',
      method: 'POST',
    });
  },
  async favoriteLIst(clerkId: string, isAdding: boolean, listId: string) {
    return fetch(`${ROOT_URL}/api/favorite-list`, {
      body: JSON.stringify({
        clerkId,
        isAdding,
        listId,
      }),
      credentials: 'same-origin',
      method: 'POST',
    });
  },
  async getLearningList(listId: string, userId?: string) {
    const parameters = new URLSearchParams({
      listId,
    });

    if (!isNil(userId)) {
      parameters.append('clerkId', userId);
    }

    return zodFetch(
      learningListReturnSchema,
      `${ROOT_URL}/api/learning-list?${parameters.toString()}`,
      {
        credentials: 'same-origin',
      },
    );
  },
  async getListCard(listId: string, userId?: string) {
    const searchParameters = new URLSearchParams({
      listId,
    });

    if (!isNil(userId)) {
      searchParameters.append('clerkId', userId);
    }

    const response = await fetch(
      `${ROOT_URL}/api/list-card?${searchParameters.toString()}`,
      {
        credentials: 'same-origin',
        method: 'GET',
      },
    );

    return response.json() as unknown as ListCardReturn;
  },
  async listPage() {
    return zodFetch(listPageReturnSchema, `${ROOT_URL}/api/list-page`, {
      credentials: 'same-origin',
    });
  },
  async manageLists(userId: string) {
    const searchParameters = new URLSearchParams({
      clerkId: userId,
    });

    return zodFetch(
      manageListsReturnSchema,
      `${ROOT_URL}/api/manage-lists?${searchParameters.toString()}`,
      {
        credentials: 'same-origin',
      },
    );
  },
  async removeMaterialFromList(
    listId: string,
    materialId: string,
    order: number,
  ) {
    return zodFetch(
      removeMaterialFromListReturnSchema,
      `${ROOT_URL}/api/remove-material-from-list`,
      {
        body: JSON.stringify({ listId, materialId, order }),
        credentials: 'same-origin',
        method: 'POST',
      },
    );
  },
  async updateListOrder(list: LearningListMaterialsFromQuery, listId: string) {
    return zodFetch(
      updateListOrderReturnSchema,
      `${ROOT_URL}/api/update-list-order`,
      {
        body: JSON.stringify({
          list,
          listId,
        }),
        credentials: 'same-origin',
        method: 'POST',
      },
    );
  },
  async updateMaterial(data: z.output<typeof updateMaterialBodySchema>) {
    return zodFetch(
      updateMaterialReturnSchema,
      `${ROOT_URL}/api/update-material`,
      {
        body: JSON.stringify(data),
        credentials: 'same-origin',
        method: 'POST',
      },
    );
  },
  async updateMaterialCompletion(
    clerkId: string,
    complete: boolean,
    materialId: string,
  ) {
    return zodFetch(
      updateMaterialCompletionReturn,
      `${ROOT_URL}/api/update-material-completion`,
      {
        body: JSON.stringify({
          clerkId,
          complete,
          materialId,
        }),
        credentials: 'same-origin',
        method: 'POST',
      },
    );
  },
};
