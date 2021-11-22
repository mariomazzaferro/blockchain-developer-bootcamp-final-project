import React, { useState, useRef } from 'react';
import { Container, Button, Form, Card } from 'react-bootstrap';

const WritePrompt = ({writePrompt}) => {
  const [prompt, setPrompt] = useState(undefined);
  const formRef = useRef(null);

  const submit = async (e) => {
    e.preventDefault();
    if(prompt && prompt !== "") {
      const resStatus = await writePrompt(prompt);
      setPrompt(undefined);
      formRef.current.reset();
      if(resStatus) {
        alert("Prompt minted successfully");
      } else {
        alert("Prompt failed");
      }
    }
  }

  const updatePrompt = (e) => {
    const prompt = e.target.value;
    setPrompt(prompt);
  }

  return (
    <Container>
      <br/>
      <Card className="shadow-lg p-3 mb-5 bg-white rounded text-center" style={{ width: 'auto' }}>
      <Card.Text>
      <Form ref={formRef} onSubmit={(e) => submit(e)}>
        <Form.Group>
        <Form.Control
          as="textarea" rows="13"
          placeholder="Write your prompt... : )"
          onChange={e => updatePrompt(e)}
        ></Form.Control>
        <Button variant="dark" type="submit" className="font-weight-bold" style={{color: "silver"}}>Mint Prompt $</Button>
        </Form.Group>
      </Form>
      </Card.Text>
      </Card>
      <br/>
    </Container>
  )
};

export default WritePrompt;