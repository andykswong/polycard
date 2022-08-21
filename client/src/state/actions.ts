export const ActionType = {
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

export function lookupAction(id: number): Action {
  return {
    type: ActionType.LOOKUP,
    id,
  };
}

export function startGameAction(hero: number, topCards: number[]): Action {
  return {
    type: ActionType.START_GAME,
    hero,
    topCards,
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
