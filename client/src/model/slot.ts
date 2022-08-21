export enum SlotType {
  Pile = 0,
  Hero = 1,
  Weapon = 2,
  Item = 3,
  Trash = 4,
}

export const SlotIcon: Readonly<Record<SlotType, string | null>> = {
  [SlotType.Pile]: null,
  [SlotType.Hero]: null,
  [SlotType.Weapon]: 'sword',
  [SlotType.Item]: 'tool',
  [SlotType.Trash]: 'trash',
};
