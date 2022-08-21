import { Hero, Cards, CardType } from './card';
import { SlotType, slotTypeOf } from './slot';

export const CARD_PILES = 4;

export const MIN_CARDS_PER_PILE = 6;

export function canDualWield(id: number) {
  return id === Hero.Swordsman;
}

export function canTrash(id: number) {
  const cardType = Cards[id]?.type;
  return cardType === CardType.Food || cardType === CardType.Treasure || cardType === CardType.Weapon;
}

export function canFitSlot(srcCard: number, dstSlot: number) {
  const cardType = Cards[srcCard]?.type;
  const dstSlotType = slotTypeOf(dstSlot);
  return (
    (dstSlotType === SlotType.Weapon && cardType === CardType.Weapon) ||
    (dstSlotType === SlotType.Item && (cardType === CardType.Food || cardType === CardType.Treasure))
  );
}
