const FrankensteinTexts = artifacts.require("FrankensteinTexts");

module.exports = function (deployer) {
  deployer.deploy(FrankensteinTexts);
};