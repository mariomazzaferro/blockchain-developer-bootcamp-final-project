const { default: Web3 } = require("web3");

const FrankensteinTexts = artifacts.require('FrankensteinTexts');

contract('FrankensteinTexts', (accounts) => {
  let frankensteinTexts;
  beforeEach(async () => {
    frankensteinTexts = await FrankensteinTexts.new();
    //await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: 1000})
  });

  it('Should have correct initial values', async () => {
    let green = await frankensteinTexts.green();
    let frankieId = await frankensteinTexts.frankieId();
    let victor = await frankensteinTexts.victor();
    assert.equal(green, true, "Green is not true!");
    assert.equal(frankieId, 0, "frankieId is not 0!");
    assert.equal(victor, accounts[0], "victor is not accounts[0]!");
  }); 
  
  it('Should seedPlot successfully', async () => {
    let rcBefore = await frankensteinTexts.requestCounter();
    let plotHash = web3.utils.randomHex(32);
    await frankensteinTexts.seedPlot(plotHash);
    let rcAfter = await frankensteinTexts.requestCounter();
    assert.equal(rcBefore, 0, "rcBefore is not 0!");
    assert.equal(rcAfter, 1, "rcAfter is not 1!");
  }); 
});