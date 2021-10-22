import React, { useEffect, useState } from 'react';
import { getWeb3, getContract } from './utils.js';
import Header from './Header.js';
import Write from './Write.js';
import SeedPlot from './SeedPlot.js';
import client from './utils.js';

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  // const [green, setGreen] = useState(undefined);
  const [victor, setVictor] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const web3 = getWeb3();
      const accounts = await web3.eth.getAccounts();
      const contract = await getContract(web3);
      // const green = await contract.methods.green().call();
      const victor = await contract.methods.victor().call();
      setWeb3(web3);
      setAccounts(accounts);
      setContract(contract);
      // setGreen(green);
      setVictor(victor);

    //   for(let i=0; i < 105; i++) {
    //     const cid = await storeString(`PlotNumber:${i}`);
    //     await contract.methods.seedPlot(cid).send({from: accounts[0], gas:3000000});
    //     const sCounter = await contract.methods.submitCounter().call();
    //     console.log(`Submit Counter: ${sCounter}`);
    //   };
    };

    init();
  }, []);

  const requestText = async () => {
    const rCounterBefore = await contract.methods.requestCounter().call();
    console.log(`rCounter before requestText:${rCounterBefore}`);
    const cid = await contract.methods.requestText().send({from: accounts[0], gas:3000000});
    console.log(`randCid at requestText:${cid.events.RequestedText.returnValues[0]}`);
    const rCounterAfter = await contract.methods.requestCounter().call();
    console.log(`rCounter after requestText:${rCounterAfter}`);
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

  const seedPlot = async string => {
    const cid = await storeString(string);
    await contract.methods.seedPlot(cid).send({from: accounts[0], gas:3000000});
    const sCounter = await contract.methods.submitCounter().call();
    console.log(`Submit Counter: ${sCounter}`);
  };

  if(
    typeof web3 === 'undefined'
    || typeof accounts === 'undefined'
    || typeof contract === 'undefined'
    
  ) {
    return <div>Loading...</div>
  }

  return (
    <div>
      
      <Write requestText={requestText} submitText={submitText} />
      <SeedPlot seedPlot={seedPlot} />
    </div>
  );
}

export default App;

// || typeof green === 'undefined'
// <Header green={green} victor={victor} />