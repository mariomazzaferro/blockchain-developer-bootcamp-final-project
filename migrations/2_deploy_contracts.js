const FrankieTexts = artifacts.require("FrankieTexts");

module.exports = function (deployer) {
  deployer.deploy(FrankieTexts);
};