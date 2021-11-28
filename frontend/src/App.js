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
  const [network, setNetwork] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const contract = await getContract(web3);
      let counter;
      try {
        counter = await contract.methods.counter().call();
      } catch(err) {
        console.log(err.message);  
      }
      
      const networkId = await web3.eth.net.getId();
      if(networkId === 1) {
        setNetwork("Ethereum");
      } else if(networkId === 3) {
        setNetwork("Ropsten");
      } else if(networkId === 4) {
        setNetwork("Rinkeby");
      } else if(networkId === 5) {
        setNetwork("Goerli");
      } else if(networkId === 5777) {
        setNetwork("Ganache");
      } 

      setWeb3(web3);
      setAccounts(accounts);
      setContract(contract);
      setCounter(counter);
    };
    init();
  }, []);

  const updateCounter = async () => {
    const c = await contract.methods.counter().call();
    setCounter(c);
  }

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
    return res.status;
  }

  const storeString = async string => {
    const blob = new Blob([string]);
    const cid = await client.storeBlob(blob);
    return cid;
  };

  const ramificate = async (newString, oldString, oldId) => {
    let formatedString = `${oldString} 0x...${newString}`;
    const cid = await storeString(formatedString);
    const res = await contract.methods.mintPrompt(cid, oldId).send({from: accounts[0] });
    return res.status;
  };

  const writePrompt = async string => {
    let formatedString = `0x...${string}`;
    const cid = await storeString(formatedString);
    const res = await contract.methods.mintPrompt(cid).send({from: accounts[0] });
    return res.status;
  };

  const promptById = async promptId => {
    const promptCid = await contract.methods.promptCids(promptId).call();
    return promptCid;
  };

  const ramificationsById = async promptId => {
    const ramifications = await contract.methods.promptRamifications(promptId).call();
    return ramifications;
  };

  const getRamificationCid = async (promptId, ramificationId) => {
    const ramiPromptId = await contract.methods.ramifications(promptId, ramificationId).call();
    const ramificationCid = await contract.methods.promptCids(ramiPromptId).call();
    return ramificationCid;
  }

  const getRamificationId = async (promptId, ramificationId) => {
    const ramiPromptId = await contract.methods.ramifications(promptId, ramificationId).call();
    return ramiPromptId;
  }

  if(
    typeof web3 === 'undefined'
    || typeof accounts === 'undefined'
    || typeof counter === 'undefined'
  ) {
    return (
      <div className="my-5 text-center">
        <img src={metamaskLogo} width="250" class="mb-4" alt=""/>
        <h1>Please install Metamask, connect to Ropsten Network and reload this page</h1>
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
          <Nav.Link className="px-5" bg="dark" as={Link} to={"/"}><h5>CRYPTO PROMPTS</h5></Nav.Link>
          <Nav.Link className="px-5" as={Link} to={"/feed"}>FEED</Nav.Link>
          <Nav.Link className="px-5" as={Link} to={"/ramifications"}>RAMIFICATIONS</Nav.Link>
          <Nav.Link className="px-5" as={Link} to={"/ownership"}>OWNERSHIP</Nav.Link>
          <Nav.Link className="px-5" as={Link} to={"/about"}>ABOUT</Nav.Link>
          </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br/>
      {accounts && <p style={{color: "silver", textAlign: "center"}}>{`Active Account: ${accounts[0]} (${network})`}</p>
      }
      <Switch>
          <Route exact path="/">
            <WritePrompt writePrompt={writePrompt} updateCounter={updateCounter} />
          </Route>
          <Route exact path="/feed">
            <Feed counter={counter} promptById={promptById} ramificationsById={ramificationsById} ramificate={ramificate} updateCounter={updateCounter} />
          </Route>
          <Route exact path="/ramifications">
            <Ramifications counter={counter} promptById={promptById} ramificationsById={ramificationsById} getRamificationCid={getRamificationCid} getRamificationId={getRamificationId} />
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