import React from 'react';
import {
  BrowserRouter as Router,
  Outlet,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import { AppStateProvider, useDispatch } from './state/State';
import { Button } from './components/Button';
import { HeroSelector } from './containers/HeroSelector';
import { Tooltip } from './containers/Tooltip';
import { Game } from './Game';

import styles from './App.module.css';
import { startGameAction } from './state/actions';

export function App() {
  return (
    <AppStateProvider>
      <div className={styles.app}>
        <Space />
        <Router>
          <Routes>
            <Route path="/" element={<WithTitle />}>
              <Route index element={<Menu />}></Route>
              <Route path="/play" element={<Game />}></Route>
            </Route>
          </Routes>
        </Router>
        <Space />
      </div>
    </AppStateProvider>
  );
}

export function WithTitle() {
  return (
    <React.Fragment>
      <Title />
      <Outlet />
    </React.Fragment>
  );
}

export const Title = () => (
  <h1 className={styles.title}>POLY <img src='img/pyramid.png' alt='' className={styles.icon}></img> CARD</h1>
);

const Space = () => <div className={styles.spacer} />;

const Menu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <div className={styles.row}>
        <p>Select a hero card to play:</p>
      </div>
      <HeroSelector />
      <Tooltip />
      <Button wide onClick={() => {
        dispatch(startGameAction());
        navigate('play');
      }}>
        Play
      </Button>
      <Button wide>Buy Cards</Button>
    </React.Fragment>
  );
};
