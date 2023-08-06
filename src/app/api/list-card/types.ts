export type GetListCardReturn = [
  (
    | {
        _count: {
          favoritedBy: number;
        };
      }
    | undefined
  ),
  {
    favoriteLists?: Array<{ id: string }>;
  },
];
