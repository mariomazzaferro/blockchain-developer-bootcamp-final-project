import React, { useEffect, useState } from 'react';
import { getWeb3, getContract, client } from './utils.js';
import Header from './Header.js';
import Write from './Write.js';
import Mint from './Mint.js';
import SeedPlot from './SeedPlot.js';

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [victor, setVictor] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const contract = await getContract(web3);
      const victor = await contract.methods.victor().call();
      setWeb3(web3);
      setAccounts(accounts);
      setContract(contract);
      setVictor(victor);

      // for(let i=0; i < 11; i++) {
      //   console.log(`Iteration:${i}`);
      //   const cid = await storeString(`PlotNumber:${i}`);
      //   await contract.methods.seedPlot(cid).send({from: accounts[0], gas:3000000});
      //   const sCounter = await contract.methods.submitCounter().call();
      //   const dCounter = await contract.methods.deckCounter().call();
      //   console.log(`Submit Counter: ${sCounter}`);
      //   console.log(`Deck Counter: ${dCounter}`);
      // };
    };

    init();
  }, []);

  const requestText = async () => {
    const cid = await contract.methods.requestText().send({from: accounts[0], gas:3000000});
    return cid;
  }

  const storeString = async string => {
    const blob = new Blob([string]);
    const cid = await client.storeBlob(blob);
    console.log(`fresh cid: ${cid}`);
    return cid;
  };

  const submitText = async (oldCid, string) => {
    const newCid = await storeString(string);
    await contract.methods.submitText(oldCid, newCid).send({from: accounts[0], gas:3000000});
    const sCounter = await contract.methods.submitCounter().call();
    console.log(`Submit Counter: ${sCounter}`);
  }

  const newestUntitledId = async () => {
    const newestUnId = await contract.methods.requestNewestUntitledId().call();
    return newestUnId;
  } 

  const requestUntitled = async id => {
    const untitled = await contract.methods.requestUntitledText(id).call();
    return untitled;
  }

  const requestUntitledEndedSince = async id => {
    const endedSince = await contract.methods.requestUntitledEndedSince(id).call();
    return endedSince;
  }

  const mintFrankie = async (untitledCid, newFrankie, unId) => {
    const nftCid = await storeString(newFrankie);
    const res = await contract.methods.mintFrankie(untitledCid, nftCid, unId).send({from: accounts[0], gas:3000000});
    const frankieId = res.events.MintedFrankie.returnValues[0];
    const nftCidFromContract = res.events.MintedFrankie.returnValues[1];
    console.log(`frankieId: ${frankieId}`);
    console.log(`nftCidFromContract: ${nftCidFromContract}`);
  }

  const seedPlot = async string => {
    const cid = await storeString(string);
    await contract.methods.seedPlot(cid).send({from: accounts[0], gas:3000000});
    const sCounter = await contract.methods.submitCounter().call();
    console.log(`Submit Counter: ${sCounter}`);
  };

  const mintedCidById = async mintedId => {
    const mintedCid = await contract.methods.mintedCidById(mintedId).call();
    return mintedCid;
  };

  if(
    typeof web3 === 'undefined'
    || typeof accounts === 'undefined'
  ) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Header victor={victor} />
      <Write requestText={requestText} submitText={submitText} />
      <SeedPlot seedPlot={seedPlot} />
      <Mint requestUntitled={requestUntitled} newestUntitledId={newestUntitledId} mintFrankie={mintFrankie} mintedCidById={mintedCidById} requestUntitledEndedSince={requestUntitledEndedSince} />
    </div>
  );
}

export default App;