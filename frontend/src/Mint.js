import React, { useState } from 'react';
import axios from 'axios';

const Mint = ({ mintFrankie, requestUntitled, discardUntitled, mintedCidById }) => {
  const [untitled, setUntitled] = useState(undefined);
  const [untitledCid, setUntitledCid] = useState(undefined);
  const [title, setTitle] = useState(undefined);
  const [mintedId, setMintedId] = useState(undefined);

  const requestUn = async () => {
    const untitledCid = await requestUntitled();
    setUntitledCid(untitledCid);
    const blob = await axios.get(`https://ipfs.io/ipfs/${untitledCid}`);
    setUntitled(blob.data);
    console.log(`Untitled Received:${blob.data}`);
  }

  const discardUn = async () => {
    console.log('Discarding...');
    discardUntitled();
    console.log('Discarded!');
  }

  const mint = async (e) => {
    e.preventDefault();
    console.log('Minted!');
    const newFrankie = title + ': ' + untitled;
    mintFrankie(untitledCid, newFrankie);
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
    <div>
      <br/>
      <button onClick={() => requestUn()}>Request Untitled Frankenstein Text</button>
      <br/>
      <button onClick={() => discardUn()}>Discard Untitled Frankenstein Text</button>
      <br/>
      <form onSubmit={(e) => mint(e)}>
        <label htmlFor="title">Title:</label>
        <textarea
          id="title" name="title" rows="5" cols="50"
          onChange={e => updateTitle(e)}
        ></textarea>
        <button>Mint Frankenstein Text</button>
      </form>
      <p>{`Untitled Frankenstein Text: ${untitled}`}</p>
      <br/>
      <br/>
      <form onSubmit={(e) => getMintedCid(e)}>
        <label htmlFor="mintedId">Minted Id:</label>
        <input
          id="mintedId" name="mintedId" type="number"
          onChange={e => updateMintedId(e)}
        ></input>
        <button>Get Minted CID by Id</button>
      </form>
    </div>
  );
}

export default Mint;