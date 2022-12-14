import React from 'react';
import {
  HashRouter as Router,
  Outlet,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import { AppStateProvider, useAppState, useDispatch } from './state/State';
import { startGame } from './state/interact';
import { GEM_PER_GAME, GEM_TOKEN_ID } from './model/game';
import { Button } from './components/Button';
import { HeroSelector } from './containers/HeroSelector';
import { WalletButton } from './containers/WalletButton';
import { Tooltip } from './containers/Tooltip';
import { Game } from './Game';
import { Shop } from './Shop';

import styles from './App.module.css';

export function App() {
  return (
    <AppStateProvider>
      <div className={styles.app}>
        <Space />
        <Router>
          <Routes>
            <Route path="/" element={<WithHeading />}>
              <Route index element={<Menu />}></Route>
              <Route path="/shop" element={<Shop />}></Route>
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

export function WithHeading() {
  return (
    <React.Fragment>
      <Heading />
      <Outlet />
    </React.Fragment>
  );
}

export const Heading = () => (
  <div className={styles.row}>
    <h1 className={styles.title}>POLY <img src={`${process.env.PUBLIC_URL}/img/pyramid.png`} alt='' className={styles.icon}></img> CARD</h1>
  </div>
);

const Space = () => <div className={styles.spacer} />;

const Menu = () => {
  const { hero, walletAddress, tokenContract, gameContract, ownedTokens } = useAppState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const gems = ownedTokens[GEM_TOKEN_ID] || 0;
  const canPlayOnChain = !!walletAddress && gems >= GEM_PER_GAME;

  return (
    <React.Fragment>
      <div className={styles.row}>
        <h3>Select a hero card to play:</h3>
      </div>
      <HeroSelector />
      <Tooltip />
      <Button wide onClick={async () => {
        await startGame(dispatch, navigate, walletAddress, tokenContract!, gameContract!, hero);
      }}>
        Play Offline
      </Button>
      <Button wide disabled={!canPlayOnChain}
        onClick={async () => {
          await startGame(dispatch, navigate, walletAddress, tokenContract!, gameContract!, hero, false);
        }}
      >
        Play / Continue On Chain (Cost: ???{GEM_PER_GAME})
      </Button>
      <Button wide disabled={!walletAddress}
        onClick={() => {
          navigate('/shop');
        }}
      >
        Shop Gems and Cards
      </Button>
      <WalletButton />
    </React.Fragment>
  );
};

const EndGame = () => {
  const navigate = useNavigate();
  const { heroHp, heroGems, practice } = useAppState();
  const win = heroHp > 0;
  const earnedGems = win || !practice ? heroGems : Math.floor(heroGems / 2);

  return (
    <React.Fragment>
      <div className={styles.row}>
        <img draggable={false} src={`${process.env.PUBLIC_URL}/img/${win ? 'laurels' : 'grave'}.png`} alt="" className={styles.endImage} />
      </div>
      <h2>{win ? `You Win!` : `You are Dead!`}</h2>
      <br />
      <h3>You earned ???{earnedGems}</h3>
      <br />
      <Button wide onClick={() => navigate('/')}>
        Back to Menu
      </Button>
    </React.Fragment>
  );
};
