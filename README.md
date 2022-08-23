# Poly Card

A solitaire card game with ERC1155 collectible hero cards. The game can be played offline, or on-chain to earn gems for buying hero cards.

## Deployed Contracts (Mumbai)
- ERC-1155: https://mumbai.polygonscan.com/address/0x344d9ff8fa2a04094c15155a3f37c2e8d52518a9
- Game: https://mumbai.polygonscan.com/address/0x0B6b42dB24267fb26FBB2B6273C849c0EF54deAd

## Inspiration
I always wanted to make a blockchain game. Many existing "blockchain games" are either very simple, or are run off-chain with NFT integration. I thought it may be interesting to have a relatively complex game running completely on-chain. Turn-based card games seem to be a good fit for this.

## What it does
It is a solitaire card game that can be played either offline or on-chain.
When playing on-chain, you spend gems (ERC-1155 tokens) to start a game that can potentially earn you more gems. You can spend gems to buy collectible cards (again, as ERC-1155 tokens) that can 

## How we built it
Frontend UI is built with React. The on-chain part consists of 2 smart contracts - 1 for ERC-1155 token and 1 for the actual gamplay.

## Challenges we ran into
This is the first non-trivial smart contract I worked on, so it took time for me to figure out how to do things like deploying and debugging the contracts. Having 2 contracts working together is not so simple. Also, randomness on blockchain (for random card generation) is hard and I ended up just using the blockhash, which is acceptable for our game. 

## Accomplishments that we're proud of
- ERC-1155 contract for game token and collectible cards. ERC-1155 is a good fit as it supports can manage all the cards in a single contract and is fungibility-agnostic.
- The complete game is playable both onchain and offchain

## What we learned
End-to-end dapp development process. Also learnt a lot about the ERC-1155/721/20 token standards while researching.

## What's next for PolyCard
- Better way to generate randomness, e.g. Chainlink VRF
- Experiment with using state channel to allow the game to run off-chain but still being able to post back verifiable game results onchain.
- More collectible cards
- Improve the UX

## Credit
Game icons from https://game-icons.net

