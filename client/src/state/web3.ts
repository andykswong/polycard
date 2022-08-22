import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { Action, walletInitAction, walletRefreshAction } from './actions';
import tokenContractMetadata from '../contracts/PolyCardTokens.json';
import { GEM_TOKEN_ID } from '../model/game';
import { Hero } from '../model/card';

export const GEM_PRICE_MATIC = 0.0005;

export const HERO_PRICE_GEMS: Record<number, number> = {
  [Hero.Archaeologist]: 200,
  [Hero.Swordsman]: 200,
}

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
  try {
    tokenContract = loadContract(web3, networkID, tokenContractMetadata);
  } catch (err) {
    console.error(err);
    return;
  }

  const ownedTokens = await getBalance(tokenContract, address);

  dispatch(walletInitAction(web3, address, networkID, tokenContract, ownedTokens));
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
