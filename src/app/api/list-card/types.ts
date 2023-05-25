export const listCardTags = (listId: string): [string] => {
  return [`list-card-${listId}`];
};

export type ListCardReturn = [
  {
    _count: {
      favoritedBy: number;
    };
  } | null,
  { favoriteLists: Array<{ id: string }> } | undefined,
];
