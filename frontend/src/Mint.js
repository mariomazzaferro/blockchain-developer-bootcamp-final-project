import React, { useState } from 'react';
import axios from 'axios';
import { Container, Button, Form } from 'react-bootstrap';

const Mint = ({ mintFrankie, requestUntitled, mintedCidById, newestUntitledId, requestUntitledEndedSince }) => {
  const [newestUnId, setNewestUnId] = useState(undefined);
  const [unId, setUnId] = useState(undefined);
  const [untitled, setUntitled] = useState(undefined);
  const [untitledCid, setUntitledCid] = useState(undefined);
  const [title, setTitle] = useState(undefined);
  const [mintedId, setMintedId] = useState(undefined);

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
    console.log(`Untitled Received Ended Since:${endedSince}`);
  }

  const mint = async (e) => {
    e.preventDefault();
    console.log('Minted!');
    const newFrankie = title + ': ' + untitled;
    mintFrankie(untitledCid, newFrankie, unId);
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
    console.log(mintedCid);
  }

  return (
    <Container>
      <br/>
      <Button variant="dark" onClick={() => requestNewestUnId()}>Get your newest Untitled Id</Button>
      <br/>
      <h5>{`Your newest Untitled Id: ${newestUnId}`}</h5>
      <Form onSubmit={(e) => requestUn(e)}>
        <Form.Group>
        <Form.Control
          type="number"
          placeholder="Untitled Id"
          onChange={e => updateUnId(e)}
        ></Form.Control>
        <Button variant="dark" type="submit">Request your Untitled by Id</Button>
        </Form.Group>
      </Form>
      <br/>
      <Form onSubmit={(e) => mint(e)}>
        <Form.Group>
        <Form.Control
          type="text" rows="5"
          placeholder="Frankenstein Text's Title"
          onChange={e => updateTitle(e)}
        ></Form.Control>
        <p>{`"${untitled}"`}</p>
        <Button variant="dark" type="submit" size="lg">Title and Mint this Frankenstein Text!</Button>
        </Form.Group>
      </Form>
      
      <br/>
      <Form onSubmit={(e) => getMintedCid(e)}>
        <Form.Group>
        <Form.Control
          placeholder="Frankenstein Text NFT Id"
          type="number"
          onChange={e => updateMintedId(e)}
        ></Form.Control>
        <Button variant="dark" type="submit">Get CID by NFT Id</Button>
        </Form.Group>
      </Form>
      <br/>
    </Container>
  );
}

export default Mint;