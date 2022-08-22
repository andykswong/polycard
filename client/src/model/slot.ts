const ID_MASK = 0xFF;
const TYPE_SHIFT = 8;

export enum SlotType {
  Pile = 0,
  Hero = 1,
  Weapon = 2,
  Item = 3,
  Trash = 4,
}

export enum SlotId {
  Pile = slotId(SlotType.Pile, 0),
  Pile1 = slotId(SlotType.Pile, 1),
  Pile2 = slotId(SlotType.Pile, 2),
  Pile3 = slotId(SlotType.Pile, 3),
  Hero = slotId(SlotType.Hero),
  Weapon = slotId(SlotType.Weapon, 0),
  Weapon1 = slotId(SlotType.Weapon, 1),
  Item = slotId(SlotType.Item),
  Trash = slotId(SlotType.Trash),
}

export const SlotIcon: Readonly<Record<SlotType, string | null>> = {
  [SlotType.Pile]: null,
  [SlotType.Hero]: null,
  [SlotType.Weapon]: 'sword',
  [SlotType.Item]: 'tool',
  [SlotType.Trash]: 'trash',
};

export function slotId(type: SlotType, num: number = 0) {
  return (type << TYPE_SHIFT) + num;
}

export function slotTypeOf(id: number) {
  return (id >> TYPE_SHIFT) as SlotType;
}

export function slotNumOf(id: number) {
  return id % ID_MASK;
}
