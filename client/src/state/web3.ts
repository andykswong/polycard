import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { CardPile, GameStates } from './reducer';
import { Action, walletInitAction, walletRefreshAction } from './actions';
import { GEM_TOKEN_ID } from '../model/game';
import { Hero } from '../model/card';

import tokenContractMetadata from '../contracts/PolyCardTokens.json';
import gameContractMetadata from '../contracts/PolyCardGame.json';
import { SlotId } from '../model/slot';

export const GEM_PRICE_MATIC = 0.0005;

export const HERO_PRICE_GEMS: Record<number, number> = {
  [Hero.Archaeologist]: 200,
  [Hero.Swordsman]: 200,
}

export const SLOT_MAPPING: Record<SlotId, number> = {
  [SlotId.Pile]: 0x000,
  [SlotId.Pile1]: 0x001,
  [SlotId.Pile2]: 0x002,
  [SlotId.Pile3]: 0x003,
  [SlotId.Hero]: 0x004,
  [SlotId.Weapon]: 0x005,
  [SlotId.Weapon1]: 0x006,
  [SlotId.Item]: 0x007,
  [SlotId.Trash]: 0x008
};

export async function connectWallet(
  dispatch: (action: Action) => void
) {
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
  const accounts = await web3.eth.requestAccounts();
  const networkID = await web3.eth.net.getId();

  if (!accounts || !accounts.length) {
    return;
  }
  const address = accounts[0];

  let tokenContract: Contract;
  let gameContract: Contract;
  try {
    tokenContract = loadContract(web3, networkID, tokenContractMetadata);
    gameContract = loadContract(web3, networkID, gameContractMetadata);
  } catch (err) {
    console.error(err);
    return;
  }

  const ownedTokens = await getBalance(tokenContract, address);

  dispatch(walletInitAction(web3, address, networkID, tokenContract, gameContract, ownedTokens));
}

export async function refreshWallet(
  tokenContract: Contract, address: string,
  dispatch: (action: Action) => void
) {
  const ownedTokens = await getBalance(tokenContract, address);
  dispatch(walletRefreshAction(ownedTokens));
}

function loadContract(web3: Web3, networkID: number, metadata: any): Contract {
  const { abi } = metadata;
  const address = metadata.networks[networkID].address;
  return new web3.eth.Contract(abi, address);
}

export async function getBalance(tokenContract: Contract, from: string): Promise<Record<number, number>> {
  const values = await tokenContract.methods.balanceOfBatch(
    [from, from, from], [GEM_TOKEN_ID, Hero.Archaeologist, Hero.Swordsman]
  ).call({ from });
  
  return {
    [GEM_TOKEN_ID]: +values[0],
    [Hero.Archaeologist]: +values[1],
    [Hero.Swordsman]: +values[2],
  };
}

export async function buyGems(tokenContract: Contract, from: string) {
  const count = 100;
  await tokenContract.methods.buyGems(count).send({ from, value: count * GEM_PRICE_MATIC * (10**18) });
}

export async function buyHero(tokenContract: Contract, from: string, id: number) {
  await tokenContract.methods.buyToken(id).send({ from });
}

export async function startGameOnChain(gameContract: Contract, from: string, hero: number) {
  await gameContract.methods.start(hero).send({ from });
}

export async function moveGameOnChain(gameContract: Contract, from: string, srcSlot: number, dstSlot: number) {
  await gameContract.methods.move(SLOT_MAPPING[srcSlot], SLOT_MAPPING[dstSlot]).send({ from });
}

export async function getGameState(gameContract: Contract, from: string): Promise<GameStates> {
  const rawState = await gameContract.methods.getGameState(from).call({ from });
  const heroState = getCardPile(rawState[SLOT_MAPPING[SlotId.Hero]]);
  return {
    hero: heroState.topCard || 0,
    heroGems: heroState.gems || 0,
    heroHp: heroState.topCardValue || 0,
    slots: {
      [SlotId.Pile]: getCardPile(rawState[SLOT_MAPPING[SlotId.Pile]]),
      [SlotId.Pile1]: getCardPile(rawState[SLOT_MAPPING[SlotId.Pile1]]),
      [SlotId.Pile2]: getCardPile(rawState[SLOT_MAPPING[SlotId.Pile2]]),
      [SlotId.Pile3]: getCardPile(rawState[SLOT_MAPPING[SlotId.Pile3]]),
      [SlotId.Weapon]: getCardPile(rawState[SLOT_MAPPING[SlotId.Weapon]]),
      [SlotId.Weapon1]: getCardPile(rawState[SLOT_MAPPING[SlotId.Weapon1]]),
      [SlotId.Item]: getCardPile(rawState[SLOT_MAPPING[SlotId.Item]]),
    },
    practice: false,
  };
}

const UINT32_MASK = BigInt('0xFFFFFFFF');

function getCardPile(state?: string): ExtendedCardPile {
  if (!state) {
    return { topCard: 0 };
  }

  const stateInt = BigInt(state);
  return {
    cards: Number((stateInt >> BigInt(96)) & UINT32_MASK),
    topCard: Number((stateInt >> BigInt(64)) & UINT32_MASK),
    topCardValue: Number((stateInt >> BigInt(32)) & UINT32_MASK),
    gems: Number(stateInt & UINT32_MASK),
  };
}

interface ExtendedCardPile extends CardPile {
  gems?: number;
}
