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
  [CardType.Hero]: null,
  [CardType.Special]: null,
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

export const Cards: Readonly<Record<number, CardDefinition>> = {
  // Hero
  [Hero.Adventurer]: {
    name: 'adventurer',
    type: CardType.Hero,
    value: 10,
    description: 'Your average adventurer',
  },
  [Hero.Archaeologist]: {
    name: 'archaeologist',
    type: CardType.Hero,
    value: 9,
    description: 'Archaeologist. Food and treasure values +1',
  },
  [Hero.Swordsman]: {
    name: 'swordsman',
    type: CardType.Hero,
    value: 12,
    description: 'Dual wielding swordsman',
  },

  // Foe
  [0x1001]: {
    name: 'anubis',
    type: CardType.Foe,
    value: 13,
    description: 'Anubis, the god of the dead',
  },

  [0x1002]: {
    name: 'pharaoh',
    type: CardType.Foe,
    value: 10,
    description: 'The Mighty Pharaoh',
  },
  [0x1004]: {
    name: 'mummy',
    type: CardType.Foe,
    value: 7,
  },
  [0x1005]: {
    name: 'cobra',
    type: CardType.Foe,
    value: 5,
  },
  [0x1006]: {
    name: 'ibis',
    type: CardType.Foe,
    value: 3,
    description: 'An ibis',
  },
  [0x1007]: {
    name: 'cat',
    type: CardType.Foe,
    value: 3,
  },
  [0x1008]: {
    name: 'beetle',
    type: CardType.Foe,
    value: 1,
  },
  [0x1009]: {
    name: 'bird',
    type: CardType.Foe,
    value: 2,
  },
  [0x100A]: {
    name: 'camel',
    type: CardType.Foe,
    value: 4,
  },
  [0x100B]: {
    name: 'sphinx',
    type: CardType.Foe,
    value: 8,
  },
  [0x100C]: {
    name: 'crocodile',
    type: CardType.Foe,
    value: 6,
  },
  [0x100D]: {
    name: 'spider',
    type: CardType.Foe,
    value: 2,
  },

  // Treasure
  [0x2001]: {
    name: 'beetle',
    type: CardType.Treasure,
    value: 1,
  },
  [0x2002]: {
    name: 'pottery',
    type: CardType.Treasure,
    value: 2,
  },
  [0x2003]: {
    name: 'gem',
    type: CardType.Treasure,
    value: 3,
  },
  [0x2004]: {
    name: 'urn',
    type: CardType.Treasure,
    value: 4,
    description: 'An urn',
  },

  // Food
  [0x3001]: {
    name: 'bread',
    type: CardType.Food,
    value: 4,
  },
  [0x3002]: {
    name: 'flask',
    type: CardType.Food,
    value: 5,
  },
  [0x3003]: {
    name: 'jug',
    type: CardType.Food,
    value: 2,
  },
  [0x3004]: {
    name: 'corn',
    type: CardType.Food,
    value: 3,
  },

  // Weapon
  [0x4001]: {
    name: 'stick',
    type: CardType.Weapon,
    value: 3,
  },
  [0x4002]: {
    name: 'gear',
    type: CardType.Weapon,
    value: 8,
    description: 'Full armor set',
  },
  [0x4003]: {
    name: 'knife',
    type: CardType.Weapon,
    value: 2,
  },
  [0x4004]: {
    name: 'pickaxe',
    type: CardType.Weapon,
    value: 4,
  },
  [0x4005]: {
    name: 'stiletto',
    type: CardType.Weapon,
    value: 5,
  },
  [0x4006]: {
    name: 'sword',
    type: CardType.Weapon,
    value: 6,
  },
}

export function getCardsByType(type: CardType) {
  return Object.keys(Cards).filter(id => Cards[+id].type === type).map(id => +id);
}

export const Heroes = getCardsByType(CardType.Hero);

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
