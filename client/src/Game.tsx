import React from 'react';

import { Card } from './containers/Card';
import { Hero } from './containers/Hero';
import { Slot } from './containers/Slot';
import { Tooltip } from './containers/Tooltip';
import { SlotType } from './model/slot';
import { useAppState, useDispatch } from './state/State';

import styles from './App.module.css';
import { canDualWield } from './model/card';

export function Game() {
  const { 
    hero, heroGems, heroHp,
    weapons, weaponValues, item,
    piles,
  } = useAppState();
  const dispatch = useDispatch();

  return (
    <React.Fragment>
      <div className={`${styles.row} ${styles.topAligned}`}>
        {piles.map(pile => (
          <Slot hiddenCards={pile.cards}>
            {pile.topCard && <Card id={pile.topCard} value={pile.topCardValue} />}
          </Slot>
        ))}
      </div>
      <br/>
      <div className={styles.row}>
        <Slot type={SlotType.Weapon}>
          {weapons[0] && <Card id={weapons[0]} value={weaponValues[0]} />}
        </Slot>
        {canDualWield(hero) && <Slot type={SlotType.Weapon}>
          {weapons[1] && <Card id={weapons[1]} value={weaponValues[1]} />}
        </Slot>}
        <Slot type={SlotType.Hero}>
          <Hero id={hero} hp={heroHp} gem={heroGems} />
        </Slot>
        <Slot type={SlotType.Item}>
          {item && <Card id={item} />}
        </Slot>
        <Slot type={SlotType.Trash} />
      </div>
      <Tooltip />
    </React.Fragment>
  )
}
