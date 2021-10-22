import React, { useState } from 'react';
import axios from 'axios';

const Write = ({requestText, submitText}) => {
  const [text, setText] = useState(undefined);
  const [cid, setCid] = useState(undefined);
  const [initialText, setInitialText] = useState(undefined);

  const request = async () => {
    const res = await requestText();
    const randCid = res.events.RequestedText.returnValues[0];
    console.log(`randCid:${randCid}`);
    const isBlank = res.events.RequestedText.returnValues[1];
    setCid(randCid);
    if(!isBlank) { 
      const blob = await axios.get(`https://ipfs.io/ipfs/${randCid}`);
      setInitialText(blob.data);
    } else {
      setInitialText("");
    }
    console.log(`cid:${cid}`);
    console.log(`isBlank:${isBlank}`);
  }

  const submit = async (e) => {
    e.preventDefault();
    const oldCid = cid;
    submitText(oldCid, text);
  }

  const updateText = (e) => {
    const text = e.target.value;
    setText(text);
  }

  return (
    <div>
      <button onClick={request}>Request Text</button>
      <h2>Write your contribution:</h2>
      <p>{initialText}</p>
      <form onSubmit={(e) => submit(e)}>
        <label htmlFor="text">Contribute:</label>
        <textarea
          id="text" name="text" rows="5" cols="50"
          onChange={e => updateText(e)}
        ></textarea>
        <button>Submit Contribution</button>
      </form>
      <button onClick={() => console.log(cid)}>Print CID</button>
    </div>
  )
};

export default Write;