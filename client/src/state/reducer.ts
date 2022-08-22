import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

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

  web3?: Web3;
  networkId: number;
  walletAddress: string;
  tokenContract?: Contract;
  gameContract?: Contract;
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

const defaultOwnedTokens = () => ({
  [0x0]: 0,
  [0x0001]: 1,
});

export const INITIAL_STATE: AppStates = {
  state: GameState.Lobby,
  tooltip: '',
  ownedTokens: defaultOwnedTokens(),
  networkId: 0,
  walletAddress: '',
  ...initialGameState(),
};

export function reducer(state: AppStates, action: Action) {
  switch (action.type) {
    case ActionType.WALLET_INIT:
      return {
        ...state,
        web3: action.web3,
        networkId: action.networkId,
        walletAddress: action.walletAddress,
        tokenContract: action.tokenContract,
        gameContract: action.gameContract,
        ownedTokens: {
          ...defaultOwnedTokens(),
          ...action.ownedTokens,
        }
      };

    case ActionType.WALLET_REFRESH:
      return {
        ...state,
        ownedTokens: {
          ...defaultOwnedTokens(),
          ...action.ownedTokens,
        }
      };

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
    
    case ActionType.UPDATE_GAME_STATE:
      return {
        ...state,
        state: GameState.Playing,
        practice: false,
        ...action.state,
      };

    case ActionType.START_PRACTICE_GAME:
      const newState = {
        ...state,
        ...initialGameState(),
        state: GameState.Playing,
        practice: action.practice,
        hero: action.hero,
        heroHp: Cards[action.hero].value,
        tooltip: '',
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
