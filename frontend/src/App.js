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
import Home from './Home.js';
import WritePrompt from './WritePrompt.js';
import Feed from './Feed.js';
import Transfer from './Transfer.js';
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
    console.log(`fresh cid: ${cid}`);
    return cid;
  };

  const comment = async (newString, oldCid) => {
    const cid = await storeString(newString);
    await contract.methods.mintPrompt(cid, oldCid).send({from: accounts[0] });
    const counter = await contract.methods.counter().call();
    console.log(`counter: ${counter}`);
  };

  const writePrompt = async string => {
    const cid = await storeString(string);
    await contract.methods.mintPrompt(cid).send({from: accounts[0] });
    const counter = await contract.methods.counter().call();
    console.log(`counter: ${counter}`);
  };

  const promptById = async promptId => {
    const promptCid = await contract.methods.promptOrder(promptId).call();
    return promptCid;
  };

  const commentsById = async promptCid => {
    const comments = await contract.methods.promptComments(promptCid).call();
    return comments;
  };

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
      <Navbar bg="dark" variant={"dark"} expand="lg">
        <Container>
          <Navbar.Brand>
            <Nav.Link  as={Link} to={"/"} style={{color: "greenyellow"}}>Writing Prompts</Nav.Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          <Nav.Link as={Link} to={"/writeprompt"} style={{color: "greenyellow"}}>Write Prompt</Nav.Link>
          <Nav.Link  as={Link} to={"/feed"} style={{color: "greenyellow"}}>Feed</Nav.Link>
          <Nav.Link  as={Link} to={"/transfer"} style={{color: "greenyellow"}}>Transfer</Nav.Link>
          </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/writeprompt">
            <WritePrompt writePrompt={writePrompt}  />
          </Route>
          <Route exact path="/feed">
            <Feed counter={counter} promptById={promptById} commentsById={commentsById} comment={comment} />
          </Route>
          <Route exact path="/transfer">
            <Transfer ownerOf={ownerOf} balanceOf={balanceOf} transfer={transfer} />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;