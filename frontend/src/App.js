import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { getWeb3, getContract, client } from './utils.js';
import WritePrompt from './WritePrompt.js';
import Feed from './Feed.js';
import Ramifications from './Ramifications.js';
import Ownership from './Ownership.js';
import About from './About.js';
import metamaskLogo from './metamask.png';

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [counter, setCounter] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const contract = await getContract(web3);
      const counter = await contract.methods.counter().call();
      
      setWeb3(web3);
      setAccounts(accounts);
      setContract(contract);
      setCounter(counter);
    };
    init();
  }, []);

  const ownerOf = async (nftId) => {
    const owner = await contract.methods.ownerOf(nftId).call();
    return owner;
  }

  const balanceOf = async (owner) => {
    const balance = await contract.methods.balanceOf(owner).call();
    return balance;
  }

  const transfer = async (from, to, tokenId) => {
    const res = await contract.methods.safeTransferFrom(from, to, tokenId).send({from: accounts[0]});
    return res;
  }

  const storeString = async string => {
    const blob = new Blob([string]);
    const cid = await client.storeBlob(blob);
    return cid;
  };

  const ramificate = async (newString, oldString, oldId) => {
    let formatedString = `${oldString} ...${accounts[0]} ${newString}`;
    const cid = await storeString(formatedString);
    const res = await contract.methods.mintPrompt(cid, oldId).send({from: accounts[0] });
    const returnedOldId = res.events.MintedPrompt.returnValues[2];
    return returnedOldId
  };

  const writePrompt = async string => {
    let formatedString = `${accounts[0]} PROMPT ${string}`;
    const cid = await storeString(formatedString);
    const res = await contract.methods.mintPrompt(cid).send({from: accounts[0] });
    const returnedNewCid = res.events.MintedPrompt.returnValues[2];
    return returnedNewCid;
  };

  const promptById = async promptId => {
    const promptCid = await contract.methods.promptOrder(promptId, 0).call();
    return promptCid;
  };

  const ramificationsById = async promptId => {
    const ramifications = await contract.methods.promptRamifications(promptId).call();
    return ramifications;
  };

  const getRamificationCid = async (promptId, ramificationId) => {
    const ramificationCid = await contract.methods.promptOrder(promptId, ramificationId).call();
    return ramificationCid;
  }

  if(
    typeof web3 === 'undefined'
    || typeof accounts === 'undefined'
  ) {
    return (
      <div className="my-5 text-center">
        <img src={metamaskLogo} width="250" class="mb-4" alt=""/>
        <h1>Please connect Metamask</h1>
      </div>
    )
  }

  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto font-weight-bold">
          <Nav.Link className="px-5" bg="dark" as={Link} to={"/"}><h5>...WRITING NFT PROMPTS</h5></Nav.Link>
          <Nav.Link className="px-5" as={Link} to={"/feed"}>FEED</Nav.Link>
          <Nav.Link className="px-5" as={Link} to={"/ramifications"}>RAMIFICATIONS</Nav.Link>
          <Nav.Link className="px-5" as={Link} to={"/ownership"}>OWNERSHIP</Nav.Link>
          <Nav.Link className="px-5" as={Link} to={"/about"}>ABOUT</Nav.Link>
          </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Switch>
          <Route exact path="/">
            <WritePrompt writePrompt={writePrompt}  />
          </Route>
          <Route exact path="/feed">
            <Feed counter={counter} promptById={promptById} ramificationsById={ramificationsById} ramificate={ramificate} />
          </Route>
          <Route exact path="/ramifications">
            <Ramifications counter={counter} promptById={promptById} ramificationsById={ramificationsById} getRamificationCid={getRamificationCid} />
          </Route>
          <Route exact path="/ownership">
            <Ownership ownerOf={ownerOf} balanceOf={balanceOf} transfer={transfer} />
          </Route>
          <Route exact path="/about">
            <About />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;