import React from 'react';

import { useAppState, useDispatch } from './state/State';
import { Card } from './containers/Card';
import { Hero } from './containers/Hero';
import { Hero as HeroId } from './model/card';

import styles from './App.module.css';
import { Button } from './components/Button';
import { GEM_TOKEN_ID } from './model/game';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from './containers/Tooltip';
import { buyGems, buyHero, GEM_PRICE_MATIC, HERO_PRICE_GEMS, refreshWallet } from './state/web3';

export function Shop() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tokenContract, walletAddress, ownedTokens } = useAppState();
  const gems = ownedTokens[GEM_TOKEN_ID] || 0;

  React.useEffect(() => {
    const id = setInterval(
      async () => {
        if (tokenContract && walletAddress) {
          await refreshWallet(tokenContract!, walletAddress, dispatch);
        }
      },
      5000
    );
    return () => clearInterval(id);
  }, []);

  return (
    <React.Fragment>
      <h3>Shop:</h3>
      <br />
      <div className={styles.row}>
        <ShopToken />
        <ShopHero id={HeroId.Archaeologist} />
        <ShopHero id={HeroId.Swordsman} />
      </div>
      <Tooltip />
      <br />
      <h3>Your Gems: {`♦${gems}`}</h3>
      <br />
      <Button wide onClick={() => navigate('/')}>
        Back to Menu
      </Button>
    </React.Fragment>
  )
}

function ShopToken() {
  const [buying, setBuying] = React.useState(false);
  const { tokenContract, walletAddress } = useAppState();
  const buyable = !buying && !!tokenContract && !!walletAddress;

  return (
    <div>
      <div
        className={`${styles.shopItem}`}
      >
        <Card id={0x20301} value={100} />
      </div>
      <Button disabled={!buyable}
        onClick={async () => {
          setBuying(true);
          try {
            await buyGems(tokenContract!, walletAddress);
          } finally {
            setBuying(false);
          }
        }}
      >
        {`${(GEM_PRICE_MATIC * 100).toFixed(2)} MATIC`}
      </Button>
    </div>
  );
}

function ShopHero({ id }: { id: number }) {
  const [buying, setBuying] = React.useState(false);
  const { ownedTokens, tokenContract, walletAddress } = useAppState();
  const buyable = !buying && !!tokenContract && !!walletAddress;
  const owned = !!ownedTokens[id];
  const price = HERO_PRICE_GEMS[id];
  const canAfford = (ownedTokens[GEM_TOKEN_ID] || 0) >= price;

  return (
    <div>
      <div
        className={`${styles.shopItem} ${owned ? styles.brought : ''}`}
      >
        <Hero id={id} />
      </div>
      <Button disabled={owned || !canAfford || !buyable} onClick={async () => {
        setBuying(true);
        try {
          await buyHero(tokenContract!, walletAddress, id);
        } finally {
          setBuying(false);
        }
      }}>
        {owned ? 'Owned' : `♦ ${HERO_PRICE_GEMS[id]}`}
      </Button>
    </div>
  );
}
