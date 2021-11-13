const FrankieTexts = artifacts.require('FrankieTexts');

contract('FrankieTexts', (accounts) => {
  let frankieTexts;
  beforeEach(async () => {
    frankieTexts = await FrankieTexts.new(10);
  });

  it('Should have correct initial values', async () => {
    let frankieId = await frankieTexts.frankieId();
    let victor = await frankieTexts.owner();
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

  it('Should transfer ownership successfully', async () => {
    let victor = await frankieTexts.owner();
    await frankieTexts.transferOwnership(accounts[1]);
    let victor2 = await frankieTexts.owner();
    await frankieTexts.transferOwnership(accounts[2], { from: accounts[1] });
    let victor3 = await frankieTexts.owner();
    assert.equal(victor, accounts[0], "victor is not accounts[0]!");
    assert.equal(victor2, accounts[1], "victor2 is not accounts[1]!");
    assert.equal(victor3, accounts[2], "victor3 is not accounts[2]!");
  });

  it('Should seedPlots successfully', async () => {
    let scBefore = await frankieTexts.submitCounter();
    let fcBefore = await frankieTexts.feedCounter();
    let dcBefore = await frankieTexts.deckCounter();
    for(let i=0; i < 15; i++) {
      await frankieTexts.seedPlot(`PlotNumber:${i}`);
    };
    let scAfter = await frankieTexts.submitCounter();
    let fcAfter = await frankieTexts.feedCounter();
    let dcAfter = await frankieTexts.deckCounter();
    assert.equal(scBefore, 0, "scBefore is not 0!");
    assert.equal(fcBefore, 0, "fcBefore is not 0!");
    assert.equal(dcBefore, 0, "dcBefore is not 0!");
    assert.equal(scAfter, 15, "scAfter is not 15!");
    assert.equal(fcAfter, 10, "fcAfter is not 10!");
    assert.equal(dcAfter, 10, "dcAfter is not 10!");
  });

  it('Should submitText successfully', async () => {
    for(let i=0; i < 15; i++) {
      await frankieTexts.seedPlot(`PlotNumber:${i}`);
    };

    let scBefore = await frankieTexts.submitCounter();
    let fcBefore = await frankieTexts.feedCounter();

    let res = await frankieTexts.requestCid();
    await frankieTexts.submitCid(`${res.logs[0].args['0']}`,`C:${res.logs[0].args['0']}`);

    let scAfter1 = await frankieTexts.submitCounter();
    let fcAfter1 = await frankieTexts.feedCounter();

    res = await frankieTexts.requestCid();
    await frankieTexts.submitCid(`${res.logs[0].args['0']}`,`C:${res.logs[0].args['0']}`);

    let scAfter2 = await frankieTexts.submitCounter();
    let fcAfter2 = await frankieTexts.feedCounter();

    assert.equal(scBefore, 15, "scBefore is not 15!");
    assert.equal(fcBefore, 10, "fcBefore is not 10!");
    assert.equal(scAfter1, 16, "scAfter1 is not 16!");
    assert.equal(fcAfter1, 11, "fcAfter1 is not 11!");
    assert.equal(scAfter2, 17, "scAfter2 is not 17!");
    assert.equal(fcAfter2, 12, "fcAfter2 is not 12!");
  });

  it('Should mintFrankie successfully', async () => {
    for(let i=0; i < 10; i++) {
      await frankieTexts.seedPlot(`PlotNumber:${i}`);
    };

    let frankieId0 = await frankieTexts.frankieId();

    for(let i=0; i < 40; i++) {
      let res = await frankieTexts.requestCid();
      await frankieTexts.submitCid(`${res.logs[0].args['0']}`,`C:${res.logs[0].args['0']}`);
      console.log(res.logs[0].args['0']);
    };

    let newestUntitledId = await frankieTexts.requestNewestUntitledId();
    let newestUntitledCid = await frankieTexts.requestUntitledCid(newestUntitledId);
    await frankieTexts.mintFrankie(newestUntitledCid,`Title1`, newestUntitledId);

    let frankieId1 = await frankieTexts.frankieId();

    let secondUntitledId = newestUntitledId-1;
    let secondUntitledCid = await frankieTexts.requestUntitledCid(secondUntitledId);
    await frankieTexts.mintFrankie(secondUntitledCid,`Title2`, secondUntitledId);

    let frankieId2 = await frankieTexts.frankieId();
    
    assert.equal(frankieId0, 0, "frankieId0 is not 0!");
    assert.equal(frankieId1, 1, "frankieId1 is not 1!");
    assert.equal(frankieId2, 2, "frankieId1 is not 1!");
  });
});