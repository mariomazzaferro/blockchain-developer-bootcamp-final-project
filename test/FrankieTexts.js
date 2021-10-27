const { default: Web3 } = require("web3");

const FrankieTexts = artifacts.require('FrankieTexts');

contract('FrankieTexts', (accounts) => {
  let frankieTexts;
  beforeEach(async () => {
    frankieTexts = await FrankieTexts.new();
  });

  it('Should have correct initial values', async () => {
    let frankieId = await frankieTexts.frankieId();
    let victor = await frankieTexts.victor();
    let feedCounter = await frankieTexts.feedCounter();
    let submitCounter = await frankieTexts.submitCounter();
    let deckCounter = await frankieTexts.deckCounter();
    let deckSize = await frankieTexts.deckSize();
    assert.equal(frankieId, 0, "frankieId is not 0!");
    assert.equal(victor, accounts[0], "victor is not accounts[0]!");
    assert.equal(feedCounter, 0, "feedCounter is not 0!");
    assert.equal(submitCounter, 0, "submitCounter is not 0!");
    assert.equal(deckCounter, 0, "deckCounter is not 0!");
    assert.equal(deckSize, 10, "deckSize is not 10!");
  });

  it('Should seedPlots and requestText successfully', async () => {
    let scBefore = await frankieTexts.submitCounter();
    let fcBefore = await frankieTexts.feedCounter();
    let dcBefore = await frankieTexts.deckCounter();
    for(let i=0; i < 15; i++) {
      await frankieTexts.seedPlot(`PlotNumber:${i}`);
    };
    let scAfter = await frankieTexts.submitCounter();
    let fcAfter = await frankieTexts.feedCounter();
    let dcAfter = await frankieTexts.deckCounter();
    console.log(`scAfter: ${scAfter}`);
    console.log(`fcAfter: ${fcAfter}`);
    console.log(`dcAfter: ${dcAfter}`);
    await frankieTexts.requestText();
    await frankieTexts.requestText();
    await frankieTexts.requestText();
    await frankieTexts.requestText();
    await frankieTexts.requestText();
    assert.equal(scBefore, 0, "scBefore is not 0!");
    assert.equal(fcBefore, 0, "fcBefore is not 0!");
    assert.equal(dcBefore, 0, "dcBefore is not 0!");
    assert.equal(scAfter, 15, "scAfter is not 105!");
    assert.equal(fcAfter, 10, "fcAfter is not 100!");
    assert.equal(dcAfter, 10, "dcAfter is not 100!");
  });

  //---------------------------------------------------------------------------
  // For the next tests to work properly, we need to stop the pseudo-random functionality

  it('Should submitText successfully', async () => {
    for(let i=0; i < 15; i++) {
      await frankieTexts.seedPlot(`PlotNumber:${i}`);
    };
    await frankieTexts.requestText();
    let scBefore = await frankieTexts.submitCounter();
    let fcBefore = await frankieTexts.feedCounter();
    await frankieTexts.submitText('PlotNumber:0','Contribution:0');
    //await frankieTexts.submitText('PlotNumber:0','Contribution:0', { from: accounts[1] }); // should revert
    //await frankieTexts.submitText('PlotNumber:1','Contribution:0'); // should revert
    let scAfter = await frankieTexts.submitCounter();
    let fcAfter = await frankieTexts.feedCounter();
    assert.equal(scBefore, 15, "scBefore is not 15!");
    assert.equal(fcBefore, 10, "fcBefore is not 10!");
    assert.equal(scAfter, 16, "scAfter is not 16!");
    assert.equal(fcAfter, 11, "fcAfter is not 11!");
  });

  it('Should mintFrankie successfully', async () => {
    for(let i=0; i < 10; i++) {
      await frankieTexts.seedPlot(`PlotNumber:${i}`);
    };

    let scBefore = await frankieTexts.submitCounter();
    let fcBefore = await frankieTexts.feedCounter();

    for(let i=0; i < 10; i++) {
      await frankieTexts.requestText();
      await frankieTexts.submitText(`PlotNumber:${i}`,`Contribution2:${i}`);
    };

    for(let i=0; i < 10; i++) {
      await frankieTexts.requestText();
      await frankieTexts.submitText(`Contribution2:${i}`,`Contribution3:${i}`);
    };

    for(let i=0; i < 10; i++) {
      await frankieTexts.requestText();
      await frankieTexts.submitText(`Contribution3:${i}`,`Contribution4:${i}`);
    };

    for(let i=0; i < 10; i++) {
      await frankieTexts.requestText();
      await frankieTexts.submitText(`Contribution4:${i}`,`Contribution5:${i}`);
    };

    let scAfter = await frankieTexts.submitCounter();
    let fcAfter = await frankieTexts.feedCounter();

    
    let newestUntitledText = await frankieTexts.requestUntitledText(newestUntitledId);
    console.log(newestUntitledText);

    for(let i=0; i < 5; i++) {
      await frankieTexts.mintFrankie(`Contribution5:0`,`Title:${i}`, i);
      let mintedCid = await frankieTexts.mintedCidById(i);
      console.log(`mintedCid${i}:${mintedCid}`);
    };
    
    assert.equal(scBefore, 10, "scBefore is not 10!");
    assert.equal(fcBefore, 10, "fcBefore is not 10!");
    assert.equal(scAfter, 40, "scAfter is not 40!");
    assert.equal(fcAfter, 40, "fcAfter is not 40!");
  });
});