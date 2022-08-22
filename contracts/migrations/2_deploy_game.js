const Cards = require('../../client/src/model/cards');
const DrawableCards = Object.keys(Cards).filter(id => Cards[+id].type !== 0).map(id => +id)

const PolyCardTokens = artifacts.require('PolyCardTokens');
const PolyCardGame = artifacts.require('PolyCardGame');

module.exports = async function(deployer) {
  await deployer.deploy(PolyCardGame, PolyCardTokens.address);

  const gameInstance = await PolyCardGame.deployed();
  await gameInstance.registerCards(DrawableCards);
  await gameInstance.registerHeroes(
    [0x0001, 0x0002, 0x0003],
    [12, 11, 13],
    [0x40301, 0x40401, 0x40601],
    [0b000, 0b011, 0b100],
  );

  const tokenInstance = await PolyCardTokens.deployed();
  await tokenInstance.setAdmin(PolyCardGame.address, true);
};
