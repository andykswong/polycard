import React from 'react';

import { Card as CardUI } from '../components/cards/Card';
import { CardColor, Cards, CardSuit } from '../model/card';
import { CardText } from './CardText';
import { SlotContext } from './Slot';

export type CardProps = {
  id: number,
  value?: number,
};

export function Card({ id, value }: CardProps) {
  const card = Cards[id];
  const displayValue = (value === undefined ? card?.value : value) | 0;
  const valueStr = `${card?.type && CardSuit[card?.type]}${displayValue}`;

  const { id: slotId } = React.useContext(SlotContext);
  const [isDragging, setIsDragging] = React.useState(false);

  function handleDragStart(e: React.DragEvent<HTMLDivElement>) {
    setIsDragging(true);
    const data = JSON.stringify({
      type: 'card',
      slotId,
      id,
      value,
    });
    e.dataTransfer.setData('text/plain', data);
    setTimeout(function() {
      (e.target as HTMLDivElement).style.visibility = 'hidden';
    }, 1);
  }

  function handleDragEnd(e: React.DragEvent<HTMLDivElement>) {
    setIsDragging(false);
    e.dataTransfer.clearData();
    setTimeout(function() {
      (e.target as HTMLDivElement).style.visibility = '';
    }, 1);
  }

  return card && (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <CardText card={id}>
        <CardUI icon={card.name} color={CardColor[card.type] || 'grey'} value={valueStr} />
      </CardText>
    </div>
  )
}
