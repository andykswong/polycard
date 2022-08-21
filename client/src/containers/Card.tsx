import { Card as CardUI } from '../components/cards/Card';
import { CardColor, Cards, CardSuit } from '../model/card';
import { CardText } from './CardText';

export type CardProps = {
  id: number,
  value?: number,
};

export function Card({ id, value }: CardProps) {
  const card = Cards[id];
  const displayValue = (value === undefined ? card.value : value) | 0;
  const valueStr = `${CardSuit[card.type]}${displayValue}`;

  return (
    <CardText card={id}>
      <CardUI icon={card.name} color={CardColor[card.type] || 'grey'} value={valueStr} />
    </CardText>
  )
}
