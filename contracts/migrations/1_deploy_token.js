const PolyCardTokens = artifacts.require("PolyCardTokens");

module.exports = function(deployer) {
  deployer.deploy(PolyCardTokens);
};
