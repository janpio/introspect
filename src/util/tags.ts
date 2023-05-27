import { revalidateTag } from 'next/cache';

export const revalidateTags = (...tags: string[]): void => {
  for (const tag of tags) {
    revalidateTag(tag);
  }
};

export const learningListTags = (listId: string): [string] => {
  return [`learning-list-${listId}`];
};

export const listCardTags = (listId: string): [string] => {
  return [`list-card-${listId}`];
};

export const listPageTags = (): [string] => {
  return ['list-page'];
};

export const manageListsTags = (clerkId: string): [string] => {
  return [`manage-lists-${clerkId}`];
};
