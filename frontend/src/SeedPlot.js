import React, { useState, useRef } from 'react';
import { Container, Button, Form } from 'react-bootstrap';

const SeedPlot = ({seedPlot}) => {
  const [plot, setPlot] = useState(undefined);
  const formRef = useRef(null);

  const submit = async (e) => {
    e.preventDefault();
    await seedPlot(plot);
    formRef.current.reset();
    setPlot(undefined);
    alert("Plot seeded successfully!");
  }

  const updatePlot = (e) => {
    const plot = e.target.value;
    setPlot(plot);
  }

  return (
    <Container>
      <br/>
      <Form ref={formRef} onSubmit={(e) => submit(e)}>
        <Form.Group>
        <Form.Control
          as="textarea" rows="10"  placeholder="Write plot..."
          onChange={e => updatePlot(e)}
        ></Form.Control>
        <Button variant="dark" type="submit" style={{color: "greenyellow"}}>Seed Plot</Button>
        </Form.Group>
      </Form>
    </Container>
  )
};

export default SeedPlot;