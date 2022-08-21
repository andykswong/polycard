import { Action, ActionType } from './actions';
import { Cards, getTooltip, Hero, Heroes, HeroStartWeapon } from '../model/card';
import { MIN_CARDS_PER_PILE, CARD_PILES } from '../model/game';
import { slotId, SlotId, SlotType } from '../model/slot';

export enum GameState {
  Lobby,
  Playing,
  End
}

export interface GameStates {
  hero: number;
  heroGems: number;
  heroHp: number;
  slots: Record<SlotId, CardPile>;
  practice: boolean;
}

export interface AppStates extends GameStates {
  state: GameState;
  tooltip: string;
  ownedTokens: Record<number, number>;
}

export interface CardPile {
  topCard: number;
  topCardValue?: number;
  cards?: number;
}

const initialGameState: () => GameStates = () => ({
  hero: Heroes[0],
  heroGems: 0,
  heroHp: 0,
  slots: {},
  practice: true,
});

export const INITIAL_STATE: AppStates = {
  state: GameState.Lobby,
  tooltip: '',
  ownedTokens: {
    [0x0]: 0,
    [0x0001]: 1,
  },
  ...initialGameState(),
};

export function reducer(state: AppStates, action: Action) {
  switch (action.type) {
    case ActionType.LOOKUP:
      return {
        ...state,
        tooltip: getTooltip(action.id),
      };

    case ActionType.SELECT_HERO:
      return {
        ...state,
        hero: action.id,
      };

    case ActionType.START_GAME:
      const newState = {
        ...state,
        ...initialGameState(),
        state: GameState.Playing,
        practice: action.practice,
        hero: action.hero,
        heroHp: Cards[action.hero].value,
      };
      newState.slots = createPiles(newState.slots, action.topCards);
      newState.slots = addHeroStartWeapon(newState.slots, action.hero);
      return newState;

    case ActionType.UPDATE_HERO:
      return {
        ...state,
        heroHp: action.hp,
        heroGems: action.gems,
      };

    case ActionType.PLACE_CARD:
      return {
        ...state,
        slots: updateSlot(state.slots, action.slotId, {
          topCard: action.card,
        }),
      };

    case ActionType.UPDATE_CARD:
      return {
        ...state,
        slots: updateSlot(state.slots, action.slotId, {
          ...state.slots[action.slotId],
          topCardValue: action.value,
        }),
      };

    case ActionType.FLIP_CARD: {
      const cards = state.slots[action.slotId]?.cards || 0;
      return {
        ...state,
        slots: updateSlot(state.slots, action.slotId, {
          cards: Math.max(0, cards - 1),
          topCard: cards ? action.card : 0,
        }),
      };
    }
  }

  return state;
};

function createPiles(slots: Record<SlotId, CardPile>, cards: number[]): Record<SlotId, CardPile> {
  for (let i = 0; i < CARD_PILES; ++i) {
    slots[slotId(SlotType.Pile, i)] = {
      cards: MIN_CARDS_PER_PILE + i,
      topCard: cards[i],
    };
  }
  return slots;
}

function addHeroStartWeapon(slots: Record<SlotId, CardPile>, hero: Hero): Record<SlotId, CardPile> {
  const startWeapon = HeroStartWeapon[hero];
  if (startWeapon) {
    slots[slotId(SlotType.Weapon, 0)] = { topCard: startWeapon };
  }
  return slots;
}

function updateSlot(slots: Record<SlotId, CardPile>, slotId: number, slot: CardPile): Record<SlotId, CardPile> {
  return {
    ...slots,
    [slotId]: slot
  };
}
