import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Container, Button, Form, Card } from 'react-bootstrap';

const Write = ({requestText, submitText}) => {
  const [text, setText] = useState(undefined);
  const [cid, setCid] = useState(undefined);
  const [initialText, setInitialText] = useState(undefined);
  const [isPlot, setIsPlot] = useState(false);
  const formRef = useRef(null);

  const request = async () => {
    const res = await requestText();
    const randCid = res.events.RequestedText.returnValues[0];
    console.log(`randCid:${randCid}`);
    setCid(randCid);
    if(!randCid.includes('000')) { 
      const blob = await axios.get(`https://ipfs.io/ipfs/${randCid}`);
      setInitialText(blob.data);
    } else {
      setInitialText("");
      setIsPlot(true);
    }
    console.log(`requestText succeded!`);
    alert("Text requested successfully!");
  }

  const submit = async (e) => {
    e.preventDefault();
    console.log('Submited!');
    const oldCid = cid;
    const newText = initialText + '// ' + text;
    await submitText(oldCid, newText);
    setInitialText(undefined);
    setIsPlot(false);
    formRef.current.reset();
    alert("Contribution submited successfully!");
  }

  const updateText = (e) => {
    const text = e.target.value;
    setText(text);
  }

  return (
    <Container>
      <br/>
      <Card className="shadow-lg p-3 mb-5 bg-white rounded" style={{ width: 'auto' }}>
      <Card.Body>
        <Card.Title>
        <Button variant="dark" onClick={request} style={{color: "greenyellow"}}>Request Text</Button>
        <br/>
        <br/>
        <h5>{isPlot && `You lucky bastard! You get the chance to start a new Frankenstein Text from scratch!`}</h5>
        <p style={{color: "lightgray"}}>{initialText && `text:`}</p>
        <h5>{initialText && `"${initialText}"`}</h5>
        </Card.Title>
        <Card.Text>
        <Form ref={formRef} onSubmit={(e) => submit(e)}>
          <Form.Group>
          <Form.Control
            placeholder="Write your contribution..."
            as="textarea" rows="9"
            onChange={e => updateText(e)}
          ></Form.Control>
          <Button variant="dark" type="submit" style={{color: "greenyellow"}}>Submit Contribution</Button>
          </Form.Group>
        </Form>
        </Card.Text>
      </Card.Body>
      </Card>
    </Container>
  )
};

export default Write;