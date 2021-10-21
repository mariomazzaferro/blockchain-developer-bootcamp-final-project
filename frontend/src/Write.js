import React, { useState } from 'react';

const Write = ({requestText, submitText}) => {
  const [text, setText] = useState(undefined);
  const [cid, setCid] = useState(undefined);
  const [isBlank, setIsBlank] = useState(undefined);

  const request = async () => {
    const res = await requestText();
    const cid = res.events.RequestedText.returnValues[0];
    const isBlank = res.events.RequestedText.returnValues[1];
    setCid(cid);
    setIsBlank(isBlank);
    console.log(cid);
    console.log(isBlank);
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
      {isBlank ? 'Lucky bastard, you get to start your own plot!' : 
        <p></p>
      }
      <h2>Write your contribution:</h2>
      <form onSubmit={(e) => submit(e)}>
        <label htmlFor="text">Contribute:</label>
        <textarea
          id="text" name="text" rows="5" cols="50"
          onChange={e => updateText(e)}
        ></textarea>
        <button>Submit Contribution</button>
      </form>
    </div>
  )
};

export default Write;