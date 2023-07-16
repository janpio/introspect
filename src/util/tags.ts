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
