const Cards = require('../../client/src/model/cards');
const DrawableCards = Object.keys(Cards).filter(id => Cards[+id].type !== 0).map(id => +id)

const PolyCardTokens = artifacts.require('PolyCardTokens');
const PolyCardGame = artifacts.require('PolyCardGame');

module.exports = async function(deployer) {
  await deployer.deploy(PolyCardGame, PolyCardTokens.address);

  const instance = await PolyCardGame.deployed();
  await instance.registerCards(DrawableCards);
};
