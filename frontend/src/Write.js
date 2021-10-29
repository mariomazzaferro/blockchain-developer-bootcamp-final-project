import React, { useState } from 'react';
import axios from 'axios';
import { Container, Button, Form } from 'react-bootstrap';

const Write = ({requestText, submitText}) => {
  const [text, setText] = useState(undefined);
  const [cid, setCid] = useState(undefined);
  const [initialText, setInitialText] = useState(undefined);

  const request = async () => {
    const res = await requestText();
    const randCid = res.events.RequestedText.returnValues[0];
    console.log(`randCid:${randCid}`);
    setCid(randCid);
    if(!randCid.includes('00000')) { 
      const blob = await axios.get(`https://ipfs.io/ipfs/${randCid}`);
      setInitialText(blob.data);
    } else {
      setInitialText("");
    }
    console.log(`requestText succeded!`);
  }

  const submit = async (e) => {
    e.preventDefault();
    console.log('Submited!');
    const oldCid = cid;
    const newText = initialText + '// ' + text;
    submitText(oldCid, newText);
  }

  const updateText = (e) => {
    const text = e.target.value;
    setText(text);
  }

  return (
    <Container>
      <br/>
      <Button variant="dark" size="lg" onClick={request}>Request Text</Button>
      <br/>
      <br/>
      <h5>{`Initial text:`}</h5>
      <h5>{`"${initialText}"`}</h5>
      <Form onSubmit={(e) => submit(e)}>
        <Form.Group>
        <Form.Control
          placeholder="Write your contribution..."
          as="textarea" rows="10"
          onChange={e => updateText(e)}
        ></Form.Control>
        <Button variant="dark" type="submit">Submit Contribution</Button>
        </Form.Group>
      </Form>
    </Container>
  )
};

export default Write;