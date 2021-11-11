import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Container, Button, Form, Card, Row, Col } from 'react-bootstrap';

const Mint = ({ mintFrankie, requestUntitled, mintedCidById, newestUntitledId, requestUntitledEndedSince }) => {
  const [newestUnId, setNewestUnId] = useState(undefined);
  const [unId, setUnId] = useState(undefined);
  const [untitled, setUntitled] = useState(undefined);
  const [untitledCid, setUntitledCid] = useState(undefined);
  const [title, setTitle] = useState(undefined);
  const [mintedId, setMintedId] = useState(undefined);
  const [timeLeft, setTimeLeft] = useState(undefined);
  const [mintedCid, setMintedCid] = useState(undefined);
  const formRef = useRef(null);

  const requestNewestUnId = async () => {
    const newestUnId = await newestUntitledId();
    setNewestUnId(newestUnId);
    console.log(newestUnId);
  }

  const updateUnId = (e) => {
    const unId = e.target.value;
    setUnId(unId);
  }

  const requestUn = async (e) => {
    e.preventDefault();
    const untitledCid = await requestUntitled(unId);
    setUntitledCid(untitledCid);
    console.log(untitledCid);
    const blob = await axios.get(`https://ipfs.io/ipfs/${untitledCid}`);
    setUntitled(blob.data);
    console.log(`Untitled Received:${blob.data}`);
    const endedSince = await requestUntitledEndedSince(unId);
    const timeLeft = 10080 - (endedSince/60);
    setTimeLeft(timeLeft);
    console.log(`Untitled Received Ended Since:${endedSince}`);
  }

  const mint = async (e) => {
    e.preventDefault();
    console.log('Minted!');
    const newFrankie = title + ': ' + untitled;
    const frankieId = await mintFrankie(untitledCid, newFrankie, unId);
    setUntitled(undefined);
    setTimeLeft(undefined);
    formRef.current.reset();
    alert(`Frankenstein Text minted successfully! NFT Id: ${frankieId}`);
  }

  const updateTitle = (e) => {
    const title = e.target.value;
    setTitle(title);
  }

  const updateMintedId = (e) => {
    const mintedId = e.target.value;
    setMintedId(mintedId);
  }

  const getMintedCid = async (e) => {
    e.preventDefault();
    const mintedCid = await mintedCidById(mintedId);
    setMintedCid(mintedCid);
    console.log(mintedCid);
  }

  return (
    <Container>
      <br/>
      <Row>
        <Col>
          <Card className="shadow-lg p-3 mb-5 bg-white rounded" style={{ width: 'auto', height:'8rem' }}>
            <Card.Body>
            <Card.Title>
            <Button variant="dark" onClick={() => requestNewestUnId()} style={{color: "greenyellow"}}>Get your newest Untitled Id</Button>
            </Card.Title>
            <Card.Text>
              <h5>{newestUnId && `Your newest Untitled Id: ${newestUnId}`}</h5>
            </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="shadow-lg p-3 mb-5 bg-white rounded" style={{ width: 'auto', height:'8rem' }}>
            <Card.Body>
            <Card.Title>
            <Form inline onSubmit={(e) => getMintedCid(e)}>
            <Form.Group>
            <Row>
            <Col>
            <Form.Control
              placeholder="NFT Id"
              type="number"
              onChange={e => updateMintedId(e)}
            ></Form.Control>
            </Col>
            <Col>
            <Button variant="dark" type="submit" style={{color: "greenyellow"}}>Get CID by NFT Id</Button>
            </Col>
            </Row>
            </Form.Group>
          </Form>
            </Card.Title>
            <Card.Text>
              {mintedCid && `NFT ID: ${mintedId}  ---  CID: ${mintedCid}`}
            </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Card className="shadow-lg p-3 mb-5 bg-white rounded" style={{ width: 'auto' }}>
        <Card.Body>
        <Card.Title>
          <Form onSubmit={(e) => requestUn(e)}>
          <Form.Group>
          <Row>
          <Col>
          <Form.Control
            type="number"
            placeholder="Untitled Id"
            onChange={e => updateUnId(e)}
          ></Form.Control>
          </Col>
          <Col>
          <Button variant="dark" type="submit" style={{color: "greenyellow"}}>Request your Untitled by Id</Button>
          </Col>
          </Row>
          <br/>
          <p style={{color: "lightgray"}}>{untitled && `YOUR UNTITLED TEXT ID ${unId}:`}</p>
          </Form.Group>
          </Form>
        </Card.Title>
        <Card.Text>
        <Form ref={formRef} onSubmit={(e) => mint(e)}>
        <Form.Group>
        <Form.Control
          type="text" rows="5"
          placeholder="Frankenstein Text's Title"
          onChange={e => updateTitle(e)}
        ></Form.Control>
        <br/>
        <h5>{untitled && `"${untitled}"`}</h5>
        <br/>
        <Button variant="dark" type="submit" size="lg" style={{color: "greenyellow"}}>Title and Mint this Frankenstein Text!</Button>
        <p style={{color: "lightgray"}}>{timeLeft && `Time left for minting: ${parseFloat(timeLeft).toFixed(2)} minutes`}</p>
        </Form.Group>
      </Form>
        </Card.Text>
        </Card.Body>
      </Card>
      <br/>
      
    </Container>
  );
}

export default Mint;