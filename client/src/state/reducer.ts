import { Action, ActionType } from './actions';
import { Cards, getTooltip, Heroes } from '../model/card';

export enum GameState {
  Lobby,
  Playing,
  End
}

export interface GameStates {
  hero: number;
  heroGems: number;
  heroHp: number;
  weapons: [number, number];
  weaponValues: [number, number];
  item: number;
  piles: CardPile[];
}

export interface AppStates extends GameStates {
  state: GameState;
  tooltip: string;
  ownedTokens: Record<number, number>;
}

export interface CardPile {
  cards: number;
  topCard: number;
  topCardValue?: number;
}

const initialGameState: () => GameStates = () => ({
  hero: Heroes[0],
  heroGems: 0,
  heroHp: 0,
  weapons: [0, 0],
  weaponValues: [0, 0],
  item: 0,
  piles: [],
});

export const INITIAL_STATE: AppStates = {
  state: GameState.Lobby,
  tooltip: '',
  ownedTokens: {
    [0x0]: 0,
    [0x0001]: 1,
    [0x0002]: 1,
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
      if (state.state === GameState.Lobby) {
        return {
          ...state,
          ...initialGameState(),
          state: GameState.Playing,
          hero: state.hero,
          heroHp: Cards[state.hero].value,
          piles: generatePiles(),
        };
      }
      break;
  }

  return state;
};

function generatePiles(): CardPile[] {
  const piles: CardPile[] = [];
  for (let i = 0; i < 5; ++i) {
    piles.push({
      cards: 6,
      topCard: 0,
    });
  }

  piles[0].topCard = 0x3003;
  piles[1].topCard = 0x1005;
  piles[1].topCardValue = 5;
  piles[2].topCard = 0x1002;
  piles[3].topCard = 0x4002;
  piles[4].topCard = 0x2004;

  return piles;
}
