import React, { useState } from 'react';
import { Container, Button, Form } from 'react-bootstrap';

const SeedPlot = ({seedPlot}) => {
  const [plot, setPlot] = useState(undefined);

  const submit = async (e) => {
    e.preventDefault();
    await seedPlot(plot);
  }

  const updatePlot = (e) => {
    const plot = e.target.value;
    setPlot(plot);
  }

  return (
    <Container>
      <br/>
      <Form onSubmit={(e) => submit(e)}>
        <Form.Group>
        <Form.Control
          as="textarea" rows="10"  placeholder="Write plot..."
          onChange={e => updatePlot(e)}
        ></Form.Control>
        <Button variant="dark" type="submit">Seed Plot</Button>
        </Form.Group>
      </Form>
    </Container>
  )
};

export default SeedPlot;