import { NavigateFunction } from 'react-router-dom';
import { Action, placeCardAction, flipCardAction, startGameAction, updateCardAction, updateHeroAction } from './actions';
import { CARD_PILES, canTrash, canFitSlot } from './../model/game';
import { Cards, CardType, Foes, Foods, Hero, Treasures, Weapons } from '../model/card';
import { slotId, SlotType, slotTypeOf } from '../model/slot';
import { CardPile, GameStates } from './reducer';

export async function startGame(
  dispatch: (action: Action) => void,
  navigate: NavigateFunction,
  hero: number,
  practice: boolean = true,
) {
  const cards: number[] = generateCards();
  dispatch(startGameAction(hero, cards, practice));
  navigate('/play');
}

export async function endGame(
  dispatch: (action: Action) => void,
  navigate: NavigateFunction,
  win: boolean
) {
  navigate('/end');
}

export async function playCard(
  state: GameStates,
  dispatch: (action: Action) => void,
  srcSlot: number,
  dstSlot: number
) {
  const srcSlotType = slotTypeOf(srcSlot);
  const srcCard = state.slots[srcSlot].topCard;
  const srcCardType = Cards[srcCard].type;
  const srcCardValue = state.slots[srcSlot].topCardValue ?? Cards[srcCard].value;
  const dstSlotType = slotTypeOf(dstSlot);
  const dstCard = state.slots[dstSlot]?.topCard || 0;
  const dstCardType = Cards[dstCard]?.type;
  const dstCardValue = state.slots[dstSlot]?.topCardValue ?? Cards[dstCard]?.value ?? 0;
  const itemValueAdj = state.hero === Hero.Archaeologist ? 1 : 0;

  function flipCard(slot = srcSlot) {
    const nextCard = generateCard();
    dispatch(flipCardAction(slot, nextCard));
  }

  switch (dstSlotType) {
    case SlotType.Trash:
      if (canTrash(srcCard)) {
        const nextCard = generateCard();
        dispatch(flipCardAction(srcSlot, nextCard));
        return;
      }
      break;
    case SlotType.Weapon:
    case SlotType.Item:
      if (canFitSlot(srcCard, dstSlot) && !dstCard) {
        flipCard();
        dispatch(placeCardAction(dstSlot, srcCard));
        return;
      }
      break;
    case SlotType.Hero:
      switch (srcCardType) {
        case CardType.Foe: {
          flipCard();
          dispatch(updateHeroAction(
            Math.max(0, state.heroHp - srcCardValue),
            state.heroGems
          ));
          return;
        }
        case CardType.Food: {
          flipCard();
          dispatch(updateHeroAction(
            Math.min(
              Cards[state.hero].value,
              state.heroHp + srcCardValue + itemValueAdj
            ),
            state.heroGems
          ));
          return;
        }
        case CardType.Treasure: {
          flipCard();
          dispatch(updateHeroAction(
            state.heroHp,
            state.heroGems + srcCardValue +  + itemValueAdj
          ));
          return;
        }
      }
      break;

    case SlotType.Pile:
      if (srcSlotType === SlotType.Weapon && dstCard && dstCardType === CardType.Foe) {
        const newDstValue = Math.max(0, dstCardValue - srcCardValue);
        if (newDstValue) {
          dispatch(updateCardAction(dstSlot, newDstValue));
        } else {
          flipCard(dstSlot);
        }
        flipCard();
        return;
      }
      break;
  }
}

export function countCards(slots: Record<number, CardPile>) {
  let cards = 0;
  for (let i = 0; i < CARD_PILES; ++i) {
    const slot = slots[slotId(SlotType.Pile, i)];
    cards += slot?.cards || 0;
    cards += (slot?.topCard ? 1 : 0);
  }
  return cards
}

function generateCards() {
  const cards: number[] = [];
  for (let i = 0; i < CARD_PILES; ++i) {
    cards.push(generateCard());
  }
  return cards;
}

function generateCard() {
  switch (random(6)) {
    case 0:
      return Treasures[random(Treasures.length)];
    case 1:
      return Foods[random(Foods.length)];
    case 2:
      return Weapons[random(Weapons.length)];
    default:
      return Foes[random(Foes.length)];
  }
}

function random(len: number) {
  return Math.floor(Math.random() * len);
}
