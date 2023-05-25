export type ListCardReturn = [
  learningList: {
    _count: {
      favoritedBy: number;
    };
  } | null,
  person: {
    favoriteLists: Array<{
      id: string;
    }>;
  } | null,
];
