export const ActionType = {
  LOOKUP: 'LOOKUP',
  SELECT_HERO: 'SELECT_HERO',
  START_GAME: 'START_GAME',
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

export function selectHeroAction(id: number): Action {
  return {
    type: ActionType.SELECT_HERO,
    id,
  };
}

export function startGameAction(): Action {
  return {
    type: ActionType.START_GAME,
  };
}
