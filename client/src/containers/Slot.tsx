import React from 'react';

import { CardBack } from '../components/cards/Back';
import { CardSlot } from '../components/cards/Slot';
import { Pile } from '../components/Pile';
import { SlotIcon, slotTypeOf } from '../model/slot';
import { playCard } from '../state/interact';
import { useAppState, useDispatch } from '../state/State';

export const SlotContext = React.createContext({ id: 0 });

export type SlotProps = {
  id: number,
  hiddenCards?: number,
  children?: React.ReactNode,
};

export function Slot({ id, hiddenCards = 0, children }: SlotProps) {
  const state = useAppState();
  const dispatch = useDispatch();
  const [isOver, setIsOver] = React.useState(false);

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    if (e.dataTransfer.types[0] === 'text/plain') {
      setIsOver(true);
      e.preventDefault();
    }
  }

  function handleDragLeave() {
    setIsOver(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    const dataJSON = e.dataTransfer.getData('text/plain');
    let data;
    try {
      data = JSON.parse(dataJSON);
    } catch {}
    if (data && data.type === 'card') {
      playCard(state, dispatch, data.slotId, id);
    }
  }

  const slotType = slotTypeOf(id);
  const icon = SlotIcon[slotType];
  const cards = [];
  for (let i = 0; i < hiddenCards; ++i) {
    cards.push(<CardBack key={-i} />);
  }
  if (children) {
    cards.push(children);
  }

  return (
    <SlotContext.Provider value={{ id }}>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
      >
        <Pile placeholder={<CardSlot icon={icon} />}>
          {cards}
        </Pile>
      </div>
    </SlotContext.Provider>
  );
}
