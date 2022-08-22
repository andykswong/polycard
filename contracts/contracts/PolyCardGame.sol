// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "./PolyCardTokens.sol";

contract PolyCardConfig {
  uint256 public constant GEMS_PER_GAME = 10;
  uint32 public constant CARD_PILES = 4;
  uint32 public constant MIN_CARDS_PER_PILE = 6;

  uint32 public constant HERO_ADVENTURER = 0x0001;

  uint32 public constant CARD_FOE = 0x01;
  uint32 public constant CARD_TREASURE = 0x02;
  uint32 public constant CARD_FOOD = 0x03;
  uint32 public constant CARD_WEAPON = 0x04;

  uint32 public constant SLOT_PILE0 = 0x000;
  uint32 public constant SLOT_PILE1 = 0x001;
  uint32 public constant SLOT_PILE2 = 0x002;
  uint32 public constant SLOT_PILE3 = 0x003;
  uint32 public constant SLOT_HERO = 0x100;
  uint32 public constant SLOT_WEAPON0 = 0x200;
  uint32 public constant SLOT_WEAPON1 = 0x201;
  uint32 public constant SLOT_ITEM = 0x300;
  uint32 public constant SLOT_TRASH = 0x400;

  function getCardType(uint32 card) internal pure returns (uint32) {
    return card >> 16;
  }

  function getCardValue(uint32 card) internal pure returns (uint32) {
    return (card >> 8) & 0xFF;
  }
}

contract PolyCardGame is PolyCardConfig, Ownable {
  PolyCardTokens public tokenContract;

  struct GameData {
    uint256 hero;
    uint32 hp;
    uint32 gems;
    mapping(uint32 => CardPile) slots;
  }

  struct CardPile {
    uint256 card;
    uint32 cardValue;
    uint32 hiddenCards;
  }

  mapping(address => GameData) internal games;

  mapping(uint32 => bool) public cards;
  mapping(uint32 => uint32[]) public cardsByType;

  constructor(PolyCardTokens _tokenContract) {
    tokenContract = _tokenContract;
  }

  function start(uint256 hero) public {
      require(tokenContract.balanceOf(address(msg.sender), tokenContract.GEM()) >= GEMS_PER_GAME);
      require(hero == HERO_ADVENTURER || tokenContract.balanceOf(address(msg.sender), hero) > 0);
      require(games[address(msg.sender)].hero == 0);

      GameData storage game = games[address(msg.sender)];
      game.hero = hero;

      uint256 rand = _rand();
  }

  function registerCards(uint32[] calldata _cards) external onlyOwner {
      for (uint256 i = 0; i < _cards.length; ++i) {
          if (!cards[_cards[i]]) {
            cards[_cards[i]] = true;
            cardsByType[getCardType(_cards[i])].push(_cards[i]);
          }
      }
  }

  function _rand() internal view returns (uint256) {
    return uint256(
      blockhash(block.number - 1)
    );
  }
}
