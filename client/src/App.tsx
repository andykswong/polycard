import React from 'react';
import {
  HashRouter as Router,
  Outlet,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import { AppStateProvider, useAppState, useDispatch } from './state/State';
import { Button } from './components/Button';
import { HeroSelector } from './containers/HeroSelector';
import { Tooltip } from './containers/Tooltip';
import { Game } from './Game';

import styles from './App.module.css';
import { startGame } from './state/interact';
import { GEM_PER_GAME } from './model/game';

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
              <Route path="/end" element={<EndGame />}></Route>
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
  const { hero } = useAppState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <div className={styles.row}>
        <h3>Select a hero card to play:</h3>
      </div>
      <HeroSelector />
      <Tooltip />
      <Button wide disabled
        onClick={async () => {
          await startGame(dispatch, navigate, hero, false);
        }}
      >
        Play On Chain (Cost: ♦${GEM_PER_GAME})
      </Button>
      <Button wide onClick={async () => {
        await startGame(dispatch, navigate, hero);
      }}>
        Play Offline
      </Button>
      <Button wide>Shop</Button>
    </React.Fragment>
  );
};

const EndGame = () => {
  const navigate = useNavigate();
  const { heroHp, heroGems } = useAppState();
  const win = heroHp > 0;
  const earnedGems = win ? heroGems : Math.floor(heroGems / 2);

  return (
    <React.Fragment>
      <div className={styles.row}>
        <img draggable={false} src={`./img/${win ? 'laurels' : 'grave'}.png`} alt="" className={styles.endImage} />
      </div>
      <h2>{win ? `You Win!` : `You are Dead!`}</h2>
      <br />
      <h3>You earned ♦{earnedGems}</h3>
      <br />
      <Button wide onClick={() => navigate('/')}>
        Back to Menu
      </Button>
    </React.Fragment>
  );
};
