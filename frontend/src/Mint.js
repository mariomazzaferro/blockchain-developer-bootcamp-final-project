import React, { useState } from 'react';
import axios from 'axios';

const Mint = ({ mintFrankie, requestUntitled, discardUntitled }) => {
  const [untitled, setUntitled] = useState(undefined);
  const [untitledCid, setUntitledCid] = useState(undefined);
  const [title, setTitle] = useState(undefined);

  const requestUn = async () => {
    const untitledCid = await requestUntitled();
    setUntitledCid(untitledCid);
    const blob = await axios.get(`https://ipfs.io/ipfs/${untitledCid}`);
    setUntitled(blob.data);
    console.log(`Untitled Received:${blob.data}`);
  }

  const discardUn = async () => {
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

  return (
    <div>
      <button onClick={() => requestUn()}>Request your next Untitled Frankenstein Text</button>
      <button onClick={() => discardUn()}>Discard Untitled Frankenstein Text</button>
      <form onSubmit={(e) => mint(e)}>
        <label htmlFor="title">Title:</label>
        <textarea
          id="title" name="title" rows="5" cols="50"
          onChange={e => updateTitle(e)}
        ></textarea>
        <button>Mint Frankenstein Text</button>
      </form>
      <p>{`Untitled Frankenstein Text: ${untitled}`}</p>
    </div>
  );
}

export default Mint;