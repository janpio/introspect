import { isNil } from 'lodash';

import { ROOT_URL } from '../../util/constants';

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
