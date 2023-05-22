type CardListArray = Array<{
  id: string;
  order: number;
}>;

export const findCard = (
  order: string,
  cards: CardListArray,
): { card: CardListArray[0] | undefined; index: number } => {
  const card = cards.find(item => {
    return String(item.order) === order;
  });

  return { card, index: card ? cards.indexOf(card) : 0 };
};

export const moveCard = (
  order: string,
  atIndex: number,
  cards: CardListArray,
): CardListArray => {
  const { card, index } = findCard(order, cards);
  const newCards = [...cards.slice(0, index), ...cards.slice(index + 1)];

  if (card) {
    return [...newCards.slice(0, atIndex), card, ...newCards.slice(atIndex)];
  }

  return [...newCards.slice(0, atIndex), ...newCards.slice(atIndex)];
};
