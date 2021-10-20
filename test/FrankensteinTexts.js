const { default: Web3 } = require("web3");

const FrankensteinTexts = artifacts.require('FrankensteinTexts');

contract('FrankensteinTexts', (accounts) => {
  let frankensteinTexts;
  beforeEach(async () => {
    frankensteinTexts = await FrankensteinTexts.new();
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
    let scBefore = await frankensteinTexts.submitCounter();
    await frankensteinTexts.seedPlot('firstPlot');
    let scAfter = await frankensteinTexts.submitCounter();
    assert.equal(scBefore, 0, "rcBefore is not 0!");
    assert.equal(scAfter, 1, "rcAfter is not 1!");
  });

  it('Should requestText successfully', async () => {
    let rcBefore = await frankensteinTexts.requestCounter();
    for(let i=0; i < 101; i++) {
      await frankensteinTexts.seedPlot(`PlotNumber:${i}`);
    };
    let scBefore = await frankensteinTexts.submitCounter();
    console.log(`scBefore:${scBefore}`);
    await frankensteinTexts.requestText(); // 1
    let green = await frankensteinTexts.green();
    console.log(`green:${green}`);
    await frankensteinTexts.requestText(); // 2
    let rcAfter = await frankensteinTexts.requestCounter();
    green = await frankensteinTexts.green();
    console.log(`green:${green}`);
    assert.equal(rcBefore, 0, "rcBefore is not 0!");
    assert.equal(rcAfter, 1, "rcAfter is not 1!");
    assert.equal(green, false, "green is not false!");
  });

  it('Should return the right CIDs', async () => {
    let rcBefore = await frankensteinTexts.requestCounter();
    for(let i=0; i < 106; i++) {
      await frankensteinTexts.seedPlot(`PlotNumber:${i}`);
    };
    let scBefore = await frankensteinTexts.submitCounter();
    console.log(`scBefore:${scBefore}`);

    let cid1 = await frankensteinTexts.requestText.call();
    console.log(`cid1:${cid1}`);
    await frankensteinTexts.requestText();
    let green = await frankensteinTexts.green();
    console.log(`green:${green}`);
    

    let cid2 = await frankensteinTexts.requestText.call();
    console.log(`cid2:${cid2}`);
    await frankensteinTexts.requestText();
    green = await frankensteinTexts.green();
    console.log(`green:${green}`);

    let cid3 = await frankensteinTexts.requestText.call();
    console.log(`cid3:${cid3}`);
    await frankensteinTexts.requestText();
    green = await frankensteinTexts.green();
    console.log(`green:${green}`);

    let cid4 = await frankensteinTexts.requestText.call();
    console.log(`cid4:${cid4}`);
    await frankensteinTexts.requestText();
    green = await frankensteinTexts.green();
    console.log(`green:${green}`);

    let cid5 = await frankensteinTexts.requestText.call();
    console.log(`cid5:${cid5}`);
    await frankensteinTexts.requestText();
    green = await frankensteinTexts.green();
    console.log(`green:${green}`);

    let cid6 = await frankensteinTexts.requestText.call();
    console.log(`cid6:${cid6}`);
    await frankensteinTexts.requestText();
    green = await frankensteinTexts.green();
    console.log(`green:${green}`);

    let cid7 = await frankensteinTexts.requestText.call();
    console.log(`cid7:${cid7}`);
    await frankensteinTexts.requestText();
    green = await frankensteinTexts.green();
    console.log(`green:${green}`);

    let cid8 = await frankensteinTexts.requestText.call();
    console.log(`cid8:${cid8}`);
    await frankensteinTexts.requestText();
    green = await frankensteinTexts.green();
    console.log(`green:${green}`);

    let rcAfter = await frankensteinTexts.requestCounter();
    console.log(`rcAfter:${rcAfter}`);

    assert.equal(rcBefore, 0, "rcBefore is not 0!");
  });

  it('Should submitText successfully', async () => {
    for(let i=0; i < 101; i++) {
      await frankensteinTexts.seedPlot(`PlotNumber:${i}`);
    };

    let scBefore = await frankensteinTexts.submitCounter();
    console.log(`scBefore:${scBefore}`);

    await frankensteinTexts.submitText('PlotNumber:7','Submited CID');

    let scAfter = await frankensteinTexts.submitCounter();
    console.log(`scAfter:${scAfter}`);

    assert.equal(scAfter, 102, "scAfter is not 102!");
  });
});