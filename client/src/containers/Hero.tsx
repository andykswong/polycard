import { HeroCard } from '../components/cards/Hero';
import { Cards } from '../model/card';
import { CardText } from './CardText';

export type HeroProps = {
  id: number,
  hp?: number,
  gem?: number,
};

export function Hero({ id, hp, gem }: HeroProps) {
  const card = Cards[id];
  const hpValue = (hp === undefined ? card?.value : hp) | 0;

  return (
    <CardText card={id}>
      <HeroCard icon={card?.name} hp={hpValue} gem={gem} />
    </CardText>
  )
}
