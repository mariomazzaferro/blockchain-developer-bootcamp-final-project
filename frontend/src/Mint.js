import React, { useState } from 'react';
import axios from 'axios';

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
    <div>
      <br/>
      <br/>
      <button onClick={() => requestNewestUnId()}>Request Newest Untitled Id</button>
      <p>{`Your Newest Untitled Id: ${newestUnId}`}</p>
      <form onSubmit={(e) => requestUn(e)}>
        <label htmlFor="unId">Untitled Id:</label>
        <input
          id="unId" name="unId" type="number"
          onChange={e => updateUnId(e)}
        ></input>
        <button>Get Untitled by Id</button>
      </form>
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
      <form onSubmit={(e) => getMintedCid(e)}>
        <label htmlFor="mintedId">Minted Id:</label>
        <input
          id="mintedId" name="mintedId" type="number"
          onChange={e => updateMintedId(e)}
        ></input>
        <button>Get CID by NFT Id</button>
      </form>
      <br/>
    </div>
  );
}

export default Mint;