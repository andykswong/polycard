import { NavigateFunction } from 'react-router-dom';
import { Contract } from 'web3-eth-contract';
import { Action, placeCardAction, flipCardAction, startPracticeGameAction, updateCardAction, updateHeroAction, updateGameStateAction } from './actions';
import { CARD_PILES, canTrash, canFitSlot } from './../model/game';
import { Cards, CardType, Foes, Foods, Hero, Treasures, Weapons } from '../model/card';
import { slotId, SlotType, slotTypeOf } from '../model/slot';
import { AppStates, CardPile, GameStates } from './reducer';
import { getGameState, moveGameOnChain, startGameOnChain } from './web3';

export async function startGame(
  dispatch: (action: Action) => void,
  navigate: NavigateFunction,
  walletAddress: string,
  tokenContract: Contract,
  gameContract: Contract,
  hero: number,
  practice: boolean = true,
) {
  if (!practice) {
    const state = await getGameState(gameContract, walletAddress);
    if (state.hero) {
      dispatch(updateGameStateAction(state));
    } else {
      await startGameOnChain(gameContract, walletAddress, hero);
      await updateGameFromChain(dispatch, gameContract, walletAddress);
    }
  } else {
    dispatch(startPracticeGameAction(hero, generateCards()));
  }
  navigate('/play');
}

export async function updateGameFromChain(
  dispatch: (action: Action) => void,
  gameContract: Contract,
  walletAddress: string,
) {
  const state = await getGameState(gameContract, walletAddress);
  dispatch(updateGameStateAction(state));
}


export async function endGame(
  dispatch: (action: Action) => void,
  navigate: NavigateFunction,
  win: boolean
) {
  navigate('/end');
}

export async function playCard(
  state: AppStates,
  dispatch: (action: Action) => void,
  srcSlot: number,
  dstSlot: number
) {
  const playLocal = state.practice;

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

  async function moveOnChain() {
    await moveGameOnChain(state.gameContract!, state.walletAddress, srcSlot, dstSlot);
  }

  switch (dstSlotType) {
    case SlotType.Trash:
      if (canTrash(srcCard)) {
        if (playLocal) {
          const nextCard = generateCard();
          dispatch(flipCardAction(srcSlot, nextCard));
        } else {
          moveOnChain();
        }
        return;
      }
      break;
    case SlotType.Weapon:
    case SlotType.Item:
      if (canFitSlot(srcCard, dstSlot) && !dstCard) {
        if (playLocal) {
          flipCard();
          dispatch(placeCardAction(dstSlot, srcCard));
        } else {
          moveOnChain();
        }
        return;
      }
      break;
    case SlotType.Hero:
      switch (srcCardType) {
        case CardType.Foe: {
          if (playLocal) {
            flipCard();
            dispatch(updateHeroAction(
              Math.max(0, state.heroHp - srcCardValue),
              state.heroGems
            ));
          } else {
            moveOnChain();
          }
          return;
        }
        case CardType.Food: {
          if (playLocal) {
            flipCard();
            dispatch(updateHeroAction(
              Math.min(
                Cards[state.hero].value,
                state.heroHp + srcCardValue + itemValueAdj
              ),
              state.heroGems
            ));
          } else {
            moveOnChain();
          }
          return;
        }
        case CardType.Treasure: {
          if (playLocal) {
            flipCard();
            dispatch(updateHeroAction(
              state.heroHp,
              state.heroGems + srcCardValue +  + itemValueAdj
            ));
          } else {
            moveOnChain();
          }
          return;
        }
      }
      break;

    case SlotType.Pile:
      if (srcSlotType === SlotType.Weapon && dstCard && dstCardType === CardType.Foe) {
        if (playLocal) {
          const newDstValue = Math.max(0, dstCardValue - srcCardValue);
          if (newDstValue) {
            dispatch(updateCardAction(dstSlot, newDstValue));
          } else {
            flipCard(dstSlot);
          }
          flipCard();
          return;
        } else {
          moveOnChain();
        }
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
