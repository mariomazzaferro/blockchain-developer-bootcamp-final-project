import React, { useState, useRef } from 'react';
import { Container, Button, Form, Card } from 'react-bootstrap';

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
      <Card className="shadow-lg p-3 mb-5 bg-white rounded" style={{ width: 'auto' }}>
      <Card.Text>
      <Form ref={formRef} onSubmit={(e) => submit(e)}>
        <Form.Group>
        <Form.Control
          as="textarea" rows="9"  placeholder="Write plot..."
          onChange={e => updatePlot(e)}
        ></Form.Control>
        <Button variant="dark" type="submit" style={{color: "greenyellow"}}>Seed Plot</Button>
        </Form.Group>
      </Form>
      </Card.Text>
      </Card>
    </Container>
  )
};

export default SeedPlot;