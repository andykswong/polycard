import React from 'react';
import { INITIAL_STATE, reducer } from './reducer';
import { Action } from './actions';

export const AppStateContext = React.createContext({
  state: INITIAL_STATE,
  dispatch: (action: Action) => {},
});

export type GameStateProviderProps = {
  children?: React.ReactNode,
};

export const AppStateProvider = ({ children }: GameStateProviderProps) => {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};

export function useDispatch(): ((action: Action) => void) {
  const { dispatch } = React.useContext(AppStateContext);
  return dispatch;
}

export function useAppState(): typeof INITIAL_STATE {
  const { state } = React.useContext(AppStateContext);
  return state;
}
