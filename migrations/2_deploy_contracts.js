const Prompts = artifacts.require("Prompts");

module.exports = function (deployer) {
  deployer.deploy(Prompts);
};