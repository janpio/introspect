export type ListCardReturn = [
  {
    _count: {
      favoritedBy: number;
    };
  } | null,
  { favoriteLists: Array<{ id: string }> } | undefined,
];
