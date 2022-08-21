import React from 'react';

import { Card } from './containers/Card';
import { Hero } from './containers/Hero';
import { Slot } from './containers/Slot';
import { Tooltip } from './containers/Tooltip';
import { SlotId, slotId, SlotType } from './model/slot';
import { useAppState, useDispatch } from './state/State';

import styles from './App.module.css';
import { canDualWield, CARD_PILES } from './model/game';

export function Game() {
  const { 
    hero, heroGems, heroHp, slots,
  } = useAppState();
  const dispatch = useDispatch();

  return (
    <React.Fragment>
      <div className={`${styles.row} ${styles.piles} ${styles.topAligned}`}>
        {Array(CARD_PILES).fill(0).map((_, i) => {
          const id = slotId(SlotType.Pile, i);
          const pile = slots[id] || {};
          return (
            <Slot key={i} id={id} hiddenCards={pile.cards}>
              {pile.topCard && <Card id={pile.topCard} value={pile.topCardValue} />}
            </Slot>
          );
        })}
      </div>
      <br/>
      <div className={styles.row}>
        <Slot id={SlotId.Weapon}>
          {slots[SlotId.Weapon]?.topCard && <Card id={slots[SlotId.Weapon].topCard} value={slots[SlotId.Weapon].topCardValue} />}
        </Slot>
        {canDualWield(hero) && <Slot id={SlotId.Weapon1}>
          {slots[SlotId.Weapon1]?.topCard && <Card id={slots[SlotId.Weapon1].topCard} value={slots[SlotId.Weapon1].topCardValue} />}
        </Slot>}
        <Slot id={SlotId.Hero}>
          <Hero id={hero} hp={heroHp} gem={heroGems} />
        </Slot>
        <Slot id={SlotId.Item}>
          {slots[SlotId.Item]?.topCard && <Card id={slots[SlotId.Item].topCard} value={slots[SlotId.Item].topCardValue} />}
        </Slot>
        <Slot id={SlotId.Trash} />
      </div>
      <Tooltip />
    </React.Fragment>
  )
}
