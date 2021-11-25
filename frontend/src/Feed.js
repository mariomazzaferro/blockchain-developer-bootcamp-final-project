import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Button, Card, Form, Row, Col } from 'react-bootstrap';

const Feed = ({promptById, counter, ramificationsById, ramificate}) => {
  const [cid, setCid] = useState(undefined);
  const [text, setText] = useState(undefined);
  const [ramifications, setRamifications] = useState(undefined);
  const [NFTId, setNFTId] = useState(undefined);
  const [showId, setShowId] = useState(undefined);
  const [ramiText, setRamiText] = useState(undefined);
  const formRef = useRef(null);

  useEffect(() => {
    setNFTId(parseInt(counter)+1);
    setText('The next prompt is the youngest, then they get older.');
    setRamifications(0);
    setShowId(0);
  }, [counter]);

  const updateRamification = (e) => {
    const rami = e.target.value;
    setRamiText(rami);
  }

  const submitRamification = async (e) => {
    e.preventDefault();
    let resStatus;
    if(ramiText && text && NFTId <= counter) {
      resStatus = await ramificate(ramiText, text, NFTId);
    }
    setRamiText(undefined);
    formRef.current.reset();
    if(resStatus) {
      alert("Ramification Prompt minted successfully");
    } else {
      alert("Ramification failed");
    }
  }

  const updateNFTId = (e) => {
    const NFTId = e.target.value;
    setNFTId(parseInt(NFTId));
  }

  const getNFT = async (e) => {
    e.preventDefault();
    if(NFTId && 0 < NFTId && NFTId <= parseInt(counter)) {
      getPrompt(NFTId);
    }
  }

  const getPrompt = async (id) => {
    const cid = await promptById(id);
    setCid(cid);
    const blob = await axios.get(`https://ipfs.io/ipfs/${cid}`);
    setText(blob.data);
    const ramifications = await ramificationsById(id);
    setRamifications(ramifications);
    setShowId(id);
  }

  const next = async () => {
    if(1 < NFTId) {
      const c = NFTId - 1;
      setNFTId(c);
      await getPrompt(c);
    }
  }

  const prev = async () => {
    if(NFTId < counter) {
      const c = NFTId + 1;
      setNFTId(c);
      getPrompt(c);
    }
  }

  return (
    <Container>
      <br/>
      <Row>
        <Col>
        <Button variant="dark" onClick={() => prev()} className="font-weight-bold" style={{color: "silver"}}>Previous Prompt</Button>
        </Col>
        <Col></Col>
        <Col></Col>
        <Col>
        <Button variant="dark" onClick={() => next()} className="font-weight-bold" style={{color: "silver"}}>Next Prompt</Button>
        </Col>
      </Row>
      <br/>
      {
        text && 
        <Card className="shadow-lg p-3 mb-5 bg-white rounded text-center" style={{ width: 'auto' }}>
        <Card.Body>
        <Card.Title>
          <h5 style={{color: "lightgray"}}>{`PROMPT ID: ${showId}`}</h5>
        </Card.Title>
        <Card.Text>
        <br/>
        <h5>{text && `${text}`}</h5>
        <br/>
        <p style={{color: "lightgray"}}>{`RAMIFICATIONS: ${ramifications}`}</p>
        <br/>
        <Form ref={formRef} onSubmit={(e) => submitRamification(e)}>
        <Form.Group>
        <Form.Control
          as="textarea" rows="13"  placeholder="Write your ramification...    Once minted, it will become a NFT prompt, anyone will be able to create new prompts by ramificating yours : )"
          onChange={e => updateRamification(e)}
        ></Form.Control>
        <Button variant="dark" type="submit" className="font-weight-bold" style={{color: "silver"}}>Mint Prompt $</Button>
        </Form.Group>
      </Form>
        </Card.Text>
        </Card.Body>
      </Card>
      }

      <Card className="shadow-lg p-3 mb-5 bg-white rounded" style={{ width: 'auto', maxWidth: '30rem' }}>
        <Card.Body>
          <Card.Title>
            <Form inline onSubmit={(e) => getNFT(e)}>
            <Form.Group>
            <Row>
            <Col>
            <Form.Control
              placeholder="NFT Id : )"
              type="number"
              onChange={e => updateNFTId(e)}
            ></Form.Control>
            </Col>
            <Col>
            <Button variant="dark" type="submit" className="font-weight-bold" style={{color: "silver"}}>Get Prompt by Id</Button>
            </Col>
            </Row>
            </Form.Group>
          </Form>
            </Card.Title>
            </Card.Body>
          </Card>
    </Container>
  );
}

export default Feed;