import { Card } from './Card';

export type HeroCardProps = {
  icon: string,
  hp: number,
  gem?: number,
};

export function HeroCard({ icon, hp, gem = 0 }: HeroCardProps) {
  const hpString = `♥${hp}`;
  return (
    <Card
      icon={icon}
      value={`${hpString}${gem ? ` ♦${gem}` : ''}`}
      bottomValue={hpString}
      color='grey'
    />
  );
}
