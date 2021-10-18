const FrankensteinTexts = artifacts.require('FrankensteinTexts');

contract('FrankensteinTexts', (accounts) => {
  let frankensteinTexts;
  beforeEach(async () => {
    frankensteinTexts = await FrankensteinTexts.new();
    //await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: 1000})
  });

  it('Should have correct values for green and frankieId', async () => {
    let green = FrankensteinTexts.methods.green();
    let frankieId = FrankensteinTexts.methods.frankieId();
    assert(green === true);
    assert(frankieId === 0);
  }); 
  
});