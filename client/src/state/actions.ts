import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

export const ActionType = {
  WALLET_INIT: 'WALLET_INIT',
  WALLET_REFRESH: 'WALLET_REFRESH',
  LOOKUP: 'LOOKUP',
  SELECT_HERO: 'SELECT_HERO',
  UPDATE_HERO: 'UPDATE_HERO',
  START_GAME: 'START_GAME',
  PLACE_CARD: 'PLACE_CARD',
  FLIP_CARD: 'FLIP_CARD',
  UPDATE_CARD: 'UPDATE_CARD',
};

export interface Action {
  type: string,
  [key: string]: any,
}

export function walletInitAction(
  web3: Web3, walletAddress: string, networkId: number,
  tokenContract: Contract,
  gameContract: Contract,
  ownedTokens: Record<number, number>,
): Action {
  return {
    type: ActionType.WALLET_INIT,
    web3,
    walletAddress,
    networkId,
    tokenContract,
    gameContract,
    ownedTokens,
  };
}

export function walletRefreshAction(
  ownedTokens: Record<number, number>,
): Action {
  return {
    type: ActionType.WALLET_REFRESH,
    ownedTokens,
  };
}

export function lookupAction(id: number): Action {
  return {
    type: ActionType.LOOKUP,
    id,
  };
}

export function startGameAction(hero: number, topCards: number[], practice: boolean): Action {
  return {
    type: ActionType.START_GAME,
    hero,
    topCards,
    practice,
  };
}

export function selectHeroAction(id: number): Action {
  return {
    type: ActionType.SELECT_HERO,
    id,
  };
}

export function updateHeroAction(hp: number, gems: number): Action {
  return {
    type: ActionType.UPDATE_HERO,
    hp,
    gems,
  };
}

export function placeCardAction(slotId: number, card: number): Action {
  return {
    type: ActionType.PLACE_CARD,
    slotId,
    card,
  };
}

export function flipCardAction(slotId: number, card: number): Action {
  return {
    type: ActionType.FLIP_CARD,
    slotId,
    card,
  };
}

export function updateCardAction(slotId: number, value: number): Action {
  return {
    type: ActionType.UPDATE_CARD,
    slotId,
    value,
  };
}
