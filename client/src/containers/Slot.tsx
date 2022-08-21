import { CardBack } from '../components/cards/Back';
import { CardSlot } from '../components/cards/Slot';
import { Pile } from '../components/Pile';
import { SlotType, SlotIcon } from '../model/slot';

export type SlotProps = {
  type?: SlotType,
  hiddenCards?: number,
  children?: React.ReactNode,
};

export function Slot({ type = SlotType.Pile, hiddenCards = 0, children }: SlotProps) {
  const icon = SlotIcon[type];
  const cards = [];
  for (let i = 0; i < hiddenCards; ++i) {
    cards.push(<CardBack key={-i} />);
  }
  if (children) {
    cards.push(children);
  }

  return (
    <Pile placeholder={<CardSlot icon={icon} />}>
      {cards}
    </Pile>
  )
}
