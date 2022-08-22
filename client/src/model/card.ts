import _Cards from './cards';

export const Cards = _Cards as Readonly<Record<number, CardDefinition>>;

export enum CardType {
  Hero = 0,
  Foe = 1,
  Treasure = 2,
  Food = 3,
  Weapon = 4,
  Special = 5,
}

export const CardTypeName: Readonly<Record<CardType, string>> = {
  [CardType.Foe]: 'Foe',
  [CardType.Treasure]: 'Treasure',
  [CardType.Food]: 'Food',
  [CardType.Weapon]: 'Weapon',
  [CardType.Hero]: 'Hero',
  [CardType.Special]: 'Special',
};

export const CardSuit: Readonly<Record<CardType, string | null>> = {
  [CardType.Foe]: '♣',
  [CardType.Treasure]: '♦',
  [CardType.Food]: '♥',
  [CardType.Weapon]: '♠',
  [CardType.Hero]: '',
  [CardType.Special]: '',
};

export const CardColor: Readonly<Record<CardType, string | null>> = {
  [CardType.Foe]: 'black',
  [CardType.Treasure]: 'gold',
  [CardType.Food]: 'red',
  [CardType.Weapon]: 'blue',
  [CardType.Hero]: 'grey',
  [CardType.Special]: 'grey',
};

export interface CardDefinition {
  name: string,
  type: CardType,
  value: number,
  description?: string,
}

export enum Hero {
  Adventurer = 0x0001,
  Archaeologist = 0x0002,
  Swordsman = 0x0003,
}

export function getCardsByType(type: CardType) {
  return Object.keys(Cards).filter(id => Cards[+id].type === type).map(id => +id);
}

export const Heroes = getCardsByType(CardType.Hero);

export const HeroStartWeapon: Record<Hero, number> = {
  [Hero.Adventurer]: 0x40301,
  [Hero.Archaeologist]: 0x40401,
  [Hero.Swordsman]: 0x40601
}

export const Foes = getCardsByType(CardType.Foe);
export const Treasures = getCardsByType(CardType.Treasure);
export const Foods = getCardsByType(CardType.Food);
export const Weapons = getCardsByType(CardType.Weapon);

export function getTooltip(card: number) {
  const cardDef = Cards[card];
  let tooltip = '';
  if (card) {
    tooltip = `[${CardTypeName[cardDef.type]}] ${cardDef.description || `A ${cardDef.name}`}`;
  }
  return tooltip;
}
