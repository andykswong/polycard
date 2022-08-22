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
  uint32 public constant HERO_DEFAULT_HP = 12;
  uint32 public constant HERO_ABILITY_EXTRA_HP = 0x01;
  uint32 public constant HERO_ABILITY_EXTRA_GEM = 0x02;
  uint32 public constant HERO_ABILITY_DUAL_WIELD = 0x04;

  uint32 public constant CARD_FOE = 0x01;
  uint32 public constant CARD_TREASURE = 0x02;
  uint32 public constant CARD_FOOD = 0x03;
  uint32 public constant CARD_WEAPON = 0x04;

  uint32 public constant SLOTS = 9;
  uint32 public constant SLOT_PILE0 = 0x000;
  uint32 public constant SLOT_PILE1 = 0x001;
  uint32 public constant SLOT_PILE2 = 0x002;
  uint32 public constant SLOT_PILE3 = 0x003;
  uint32 public constant SLOT_HERO = 0x004;
  uint32 public constant SLOT_WEAPON0 = 0x005;
  uint32 public constant SLOT_WEAPON1 = 0x006;
  uint32 public constant SLOT_ITEM = 0x007;
  uint32 public constant SLOT_TRASH = 0x008;

  function getCardType(uint32 card) internal pure returns (uint32) {
    return card >> 16;
  }

  function getCardValue(uint32 card) internal pure returns (uint32) {
    return (card >> 8) & 0xFF;
  }
}

contract PolyCardGame is PolyCardConfig, Ownable {
  PolyCardTokens public tokenContract;

  mapping(uint32 => bool) public cards;
  mapping(uint32 => uint32[]) public cardsByType;

  mapping(uint32 => uint32) public heroHps;
  mapping(uint32 => uint32) public heroStartWeapons;
  mapping(uint32 => uint32) public heroAbilities;

  mapping(address => uint256[SLOTS]) public games;

  event GameStart(address player);
  event GameEnd(address player, bool win, uint256 gems);

  constructor(PolyCardTokens _tokenContract) {
    tokenContract = _tokenContract;
  }

  function start(uint32 hero) public {
      require(tokenContract.balanceOf(address(msg.sender), tokenContract.GEM()) >= GEMS_PER_GAME);
      require(hero == HERO_ADVENTURER || tokenContract.balanceOf(address(msg.sender), hero) > 0);

      uint256 rand = _rand();

      uint256[SLOTS] memory game;
      game[SLOT_HERO] = newSlot(0, hero, getHeroMaxHp(hero), 0);
      game[SLOT_WEAPON0] = newSlot(0, heroStartWeapons[hero], getCardValue(heroStartWeapons[hero]), 0);
      for (uint32 i = 0; i < CARD_PILES; ++i) {
        (uint32 card, uint256 nextRand) = getRandomCard(rand);
        rand = nextRand;
        game[SLOT_PILE0 + i] = newSlot(MIN_CARDS_PER_PILE + i, card, getCardValue(card), 0);
      }
      games[address(msg.sender)] = game;

      tokenContract.safeTransferFrom(msg.sender, address(tokenContract), tokenContract.GEM(), GEMS_PER_GAME, '');

      emit GameStart(msg.sender);
  }

  function move(uint32 fromSlot, uint32 toSlot) public {
    uint256[SLOTS] storage state = games[msg.sender];
    (, uint32 hero, uint32 hp, uint32 gems) = getSlot(state[SLOT_HERO]);
    (uint32 srcCards, uint32 srcCard, uint32 srcValue,) = getSlot(state[fromSlot]);
    (uint32 dstCards, uint32 dstCard, uint32 dstValue,) = getSlot(state[toSlot]);
    require(hero > 0 && hp > 0 && srcCard > 0);

    uint32 srcCardType = getCardType(srcCard);

    if (toSlot == SLOT_TRASH) {
      require(srcCardType == CARD_FOOD || srcCardType == CARD_TREASURE || srcCardType == CARD_WEAPON);
      state[fromSlot] = flipSlot(srcCards);
      checkEndGame(msg.sender);
      return;
    }
    
    if (
      ((toSlot == SLOT_WEAPON0 || (toSlot == SLOT_WEAPON1 && canDualWield(hero))) && srcCardType == CARD_WEAPON) ||
      (toSlot == SLOT_ITEM && (srcCardType == CARD_FOOD || srcCardType == CARD_TREASURE))
    ) {
      require(dstCard == 0);
      state[toSlot] = newSlot(0, srcCard, srcValue, 0);
      state[fromSlot] = flipSlot(srcCards);
      checkEndGame(msg.sender);
      return;
    }
    
    if (toSlot == SLOT_HERO) {
      require(srcCardType == CARD_FOOD || srcCardType == CARD_TREASURE || srcCardType == CARD_FOE);
      uint32 newHp = 0;

      if (srcCardType == CARD_FOOD) {
        newHp = hp + srcValue + getExtraHp(hero);
        if (newHp > getHeroMaxHp(hero)) {
          newHp = getHeroMaxHp(hero);
        }
        state[toSlot] = newSlot(0, hero, newHp, gems);
        state[fromSlot] = flipSlot(srcCards);
        checkEndGame(msg.sender);
      } else if (srcCardType == CARD_TREASURE) {
        state[toSlot] = newSlot(0, hero, hp, gems + srcValue + getExtraGem(hero));
        state[fromSlot] = flipSlot(srcCards);
        checkEndGame(msg.sender);
      } else if (srcCardType == CARD_FOE) {
        if (hp > srcValue) {
          newHp = hp - srcValue;
        }
        state[toSlot] = newSlot(0, hero, newHp, gems);
        state[fromSlot] = flipSlot(srcCards);
        checkEndGame(msg.sender);
      }
      return;
    }
    
    if (toSlot >= SLOT_PILE0 && toSlot <= SLOT_PILE3) {
      require(srcCardType == CARD_WEAPON && dstCard > 0 && getCardType(dstCard) == CARD_FOE);
      state[fromSlot] = flipSlot(srcCards);
      if (srcValue >= dstValue) {
        state[toSlot] = flipSlot(dstCards);
        checkEndGame(msg.sender);
      } else {
        state[toSlot] = newSlot(dstCards, dstCard, dstValue - srcValue, 0);
      }
      return;
    }

    require(false, 'Invalid move');
  }

  function checkEndGame(address account) public {
    (, uint32 hero, uint32 hp, uint32 gems) = getSlot(games[account][SLOT_HERO]);
    require(hero > 0);
    uint32 remainingCards = countCards(account);

    bool win = remainingCards == 0;
    bool lose = hp == 0;

    if (win || lose) {
      uint32 earnedGems = gems;
      if (lose) {
        earnedGems = gems / 2;
      }

      tokenContract.safeTransferFrom(address(tokenContract), msg.sender, tokenContract.GEM(), earnedGems, '');

      games[account][SLOT_HERO] = newSlot(0, 0, hp, earnedGems);

      emit GameEnd(account, win, earnedGems);
    }
  }

  function getGameState(address account) public view returns (uint256[SLOTS] memory) {
    return games[account];
  }

  function registerCards(uint32[] calldata _cards) external onlyOwner {
      for (uint256 i = 0; i < _cards.length; ++i) {
          if (!cards[_cards[i]]) {
            cards[_cards[i]] = true;
            cardsByType[getCardType(_cards[i])].push(_cards[i]);
          }
      }
  }

  function registerHeroes(
    uint32[] calldata heroes,
    uint32[] calldata hps,
    uint32[] calldata startWeapons,
    uint32[] calldata abilities
  ) external onlyOwner {
      for (uint256 i = 0; i < heroes.length; ++i) {
          heroHps[heroes[i]] = hps[i];
          heroStartWeapons[heroes[i]] = startWeapons[i];
          heroAbilities[heroes[i]] = abilities[i];
      }
  }

  function _rand() internal view returns (uint256) {
    return uint256(
      blockhash(block.number - 1)
    );
  }

  function getRandomCard(uint256 rand) internal view returns (uint32, uint256) {
    uint32 rand1 = uint32(rand) % 6;
    uint256 nextRand = rand >> 32;

    uint32 cardType = CARD_FOE;
    if (rand1 == 0) {
      cardType = CARD_TREASURE;
    } else if (rand1 == 1) {
      cardType = CARD_FOOD;
    } else if (rand1 == 2) {
      cardType = CARD_WEAPON;
    }

    uint32 rand2 = uint32(rand) % uint32(cardsByType[cardType].length);
    nextRand = rand >> 32;

    uint32 randCard = cardsByType[cardType][rand2];

    return (randCard, nextRand);
  }

  function getHeroMaxHp(uint32 hero) internal view returns (uint32) {
    uint32 hp = heroHps[hero];
    if (hp == 0) {
      hp = HERO_DEFAULT_HP;
    }
    return hp;
  }

  function getExtraGem(uint32 hero) internal view returns (uint32) {
    uint32 hasAbility = heroAbilities[hero] & HERO_ABILITY_EXTRA_GEM;
    if (hasAbility > 0) {
      return 1;
    }
    return 0;
  }

  function getExtraHp(uint32 hero) internal view returns (uint32) {
    uint32 hasAbility = heroAbilities[hero] & HERO_ABILITY_EXTRA_HP;
    if (hasAbility > 0) {
      return 1;
    }
    return 0;
  }

  function canDualWield(uint32 hero) internal view returns (bool) {
    uint32 hasAbility = heroAbilities[hero] & HERO_ABILITY_DUAL_WIELD;
    return hasAbility > 0;
  }

  function newSlot(
    uint32 hiddenCards,
    uint32 card,
    uint32 value,
    uint32 gems
  ) internal pure returns (uint256) {
    return (((((uint256(hiddenCards) << 32) + card) << 32) + value) << 32) + gems;
  }

  function getSlot(uint256 slot) internal pure returns (uint32, uint32, uint32, uint32) {
    uint32 gems = uint32(slot);
    uint32 value = uint32(slot >> 32);
    uint32 card = uint32(slot >> 64);
    uint32 hiddenCards = uint32(slot >> 96);
    return (hiddenCards, card, value, gems);
  }

  function flipSlot(uint32 hiddenCards) internal view returns (uint256) {
    if (hiddenCards > 0) {
      (uint32 card,) = getRandomCard(_rand());
      return newSlot(hiddenCards - 1, card, getCardValue(card), 0);
    } else {
      return newSlot(0, 0, 0, 0);
    }
  }

  function countCards(address account) internal view returns (uint32) {
    uint32 total = 0;
    for (uint32 i = 0; i < CARD_PILES; ++i) {
      (uint32 count, uint32 topCard,,) = getSlot(games[account][SLOT_PILE0 + i]);
      total += count;
      if (topCard > 0) {
        total += 1;
      }
    }
    return total;
  }
}
