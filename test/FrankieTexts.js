const FrankieTexts = artifacts.require('FrankieTexts');

contract('FrankieTexts', (accounts) => {
  let frankieTexts;
  beforeEach(async () => {
    frankieTexts = await FrankieTexts.new(10);
  });

  // Check if the contract is initialized correctly.
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

  // Check if openzeppelin's Ownable functionalities are working properly.
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

  // Checks if seedPlot() and seedBlankPlot() are working properly.
  it('Should seedPlots successfully', async () => {
    let scBefore = await frankieTexts.submitCounter();
    let fcBefore = await frankieTexts.feedCounter();
    let dcBefore = await frankieTexts.deckCounter();
    for(let i=0; i < 15; i++) {
      if(i % 2 == 0) {
        await frankieTexts.seedPlot(`PlotNumber:${i}`);
      } else {
        await frankieTexts.seedBlankPlot();
      }
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

  // Checks if requestCid() and submitCid() are working properly.
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

  // Checks if mintFrankie() and its supporting functions are working properly.
  it('Should mintFrankie successfully', async () => {
    for(let i=0; i < 10; i++) {
      await frankieTexts.seedPlot(`PlotNumber:${i}`);
    };

    let frankieId0 = await frankieTexts.frankieId();

    for(let i=0; i < 40; i++) {
      let res = await frankieTexts.requestCid();
      await frankieTexts.submitCid(`${res.logs[0].args['0']}`,`C:${res.logs[0].args['0']}`);
      //console.log(res.logs[0].args['0']);
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

  // Checks if ERC721 transfer functionality is working properly.
  it('Should transfer NFT successfully', async () => {
    for(let i=0; i < 10; i++) {
      await frankieTexts.seedPlot(`PlotNumber:${i}`);
    };

    let frankieId0 = await frankieTexts.frankieId();

    for(let i=0; i < 40; i++) {
      let res = await frankieTexts.requestCid();
      await frankieTexts.submitCid(`${res.logs[0].args['0']}`,`C:${res.logs[0].args['0']}`);
    };

    let newestUntitledId = await frankieTexts.requestNewestUntitledId();
    let newestUntitledCid = await frankieTexts.requestUntitledCid(newestUntitledId);
    await frankieTexts.mintFrankie(newestUntitledCid,`Title1`, newestUntitledId);

    let frankieId1 = await frankieTexts.frankieId();

    let secondUntitledId = newestUntitledId-1;
    let secondUntitledCid = await frankieTexts.requestUntitledCid(secondUntitledId);
    await frankieTexts.mintFrankie(secondUntitledCid,`Title2`, secondUntitledId);

    let frankieId2 = await frankieTexts.frankieId();

    let owner0Before = await frankieTexts.ownerOf(0);
    let balance0Before = await frankieTexts.balanceOf(accounts[0]);
    let balance1Before = await frankieTexts.balanceOf(accounts[1]);

    await frankieTexts.safeTransferFrom(accounts[0], accounts[1], 0);

    let owner0After = await frankieTexts.ownerOf(0);
    let balance0After = await frankieTexts.balanceOf(accounts[0]);
    let balance1After = await frankieTexts.balanceOf(accounts[1]);
    
    assert.equal(frankieId0, 0, "frankieId0 is not 0!");
    assert.equal(frankieId1, 1, "frankieId1 is not 1!");
    assert.equal(frankieId2, 2, "frankieId2 is not 1!");

    assert.equal(owner0Before, accounts[0], "owner0Before of NFT Id = 0 is not accounts[0]!");
    assert.equal(balance0Before, 2, "balance0Before is not 2!");
    assert.equal(balance1Before, 0, "balance1Before is not 0!");

    assert.equal(owner0After, accounts[1], "owner0After of NFT Id = 0 is not accounts[1]!");
    assert.equal(balance0After, 1, "balance0After is not 1!");
    assert.equal(balance1After, 1, "balance1After is not 0!");
  });
});