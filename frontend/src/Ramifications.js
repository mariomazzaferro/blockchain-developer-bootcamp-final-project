import React, { useState } from 'react';
import axios from 'axios';
import { Container, Button, Card, Form, Row, Col } from 'react-bootstrap';

const Ramifications = ({promptById, counter, ramificationsById, getRamificationCid}) => {
  const [cid, setCid] = useState(undefined);
  const [text, setText] = useState(undefined);
  const [ramNumber, setRamNumber] = useState(undefined);
  const [showRamNumber, setShowRamNumber] = useState(undefined);

  const [ramifications, setRamifications] = useState(undefined);
  const [NFTId, setNFTId] = useState(undefined);

  const [showNFTId, setShowNFTId] = useState(undefined);

  const updateRamNumber = (e) => {
    const ramNum = e.target.value;
    setRamNumber(parseInt(ramNum));
  }

  const updateNFTId = (e) => {
    const NFTId = e.target.value;
    setNFTId(parseInt(NFTId));
  }

  const getNFT = async (e) => {
    e.preventDefault();
    if(NFTId && 0 < NFTId && NFTId <= parseInt(counter)) {
      if(!ramNumber) {
        await getPrompt(NFTId, 1);
      } else {
        await getPrompt(NFTId, ramNumber);
      }
    }
  }

  const getPrompt = async (promptId, ramificationNumber) => {
    const cid = await getRamificationCid(promptId, ramificationNumber);
    setCid(cid);
    const blob = await axios.get(`https://ipfs.io/ipfs/${cid}`);
    setText(blob.data);
    const rams = await ramificationsById(promptId);
    setRamifications(rams);
    setShowNFTId(promptId);
    setShowRamNumber(ramificationNumber);
  }

  const next = async () => {
    if(ramNumber < ramifications) {
      const c = ramNumber + 1;
      setRamNumber(c);
      await getPrompt(NFTId, c);
    }
  }

  const prev = async () => {
    if(ramNumber > 1) {
      const c = ramNumber - 1;
      setRamNumber(c);
      await getPrompt(NFTId, c);
    }
  }

  return (
    <Container>
      <br/>
      <Row>
        <Col>
        <Button variant="dark" onClick={() => prev()} className="font-weight-bold" style={{color: "silver"}}>Previous Ramification</Button>
        </Col>
        <Col></Col>
        <Col></Col>
        <Col>
        <Button variant="dark" onClick={() => next()} className="font-weight-bold" style={{color: "silver"}}>Next Ramification</Button>
        </Col>
      </Row>
      <br/>
      {
        text && 
        <Card className="shadow-lg p-3 mb-5 bg-white rounded text-center" style={{ width: 'auto' }}>
        <Card.Body>
        <Card.Title>
          <h5 style={{color: "lightgray"}}>{showNFTId && `PROMPT ID: ${showNFTId}`}</h5>
          <h5 style={{color: "lightgray"}}>{showRamNumber && `RAMIFICATION: ${showRamNumber}`}</h5>
        </Card.Title>
        <Card.Text>
        <br/>
        <h5>{text && `${text}`}</h5>
        <br/>
        <p style={{color: "lightgray"}}>{`RAMIFICATIONS: ${ramifications}`}</p>
        </Card.Text>
        </Card.Body>
      </Card>
      }

      <Card className="shadow-lg p-3 mb-5 bg-white rounded text-center" style={{ width: 'auto', maxWidth: '64rem' }}>
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
            <Form.Control
              placeholder="Ramification Number : )"
              type="number"
              onChange={e => updateRamNumber(e)}
            ></Form.Control>
            </Col>
            <Col>
            <Button variant="dark" type="submit" className="font-weight-bold" style={{color: "silver"}}>Get Ramification</Button>
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

export default Ramifications;
