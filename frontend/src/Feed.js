import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Card, Form, Row, Col } from 'react-bootstrap';

const Feed = ({mintedCidById, frankieId, starsById}) => {
  const [counter, setCounter] = useState(0);
  const [cid, setCid] = useState(undefined);
  const [text, setText] = useState(undefined);
  const [stars, setStars] = useState(undefined);
  const [showId, setShowId] = useState(undefined);
  const [NFTId, setNFTId] = useState(undefined);

  useEffect(() => {
    next();
  }, [frankieId]);

  const updateNFTId = (e) => {
    const NFTId = e.target.value;
    setNFTId(NFTId);
  }

  const getNFT = async (e) => {
    e.preventDefault();
    console.log(NFTId);
    if(NFTId && 0 <= NFTId && NFTId <= parseInt(frankieId)) {
      getFrankie(NFTId);
      setShowId(NFTId);
      const counter = frankieId - NFTId;
      setCounter(counter);
    }
  }

  const getFrankie = async (id) => {
    const cid = await mintedCidById(id);
    setCid(cid);
    console.log(`cid: ${cid}`);

    const blob = await axios.get(`https://ipfs.io/ipfs/${cid}`);
    setText(blob.data);
    console.log(`text: ${blob.data}`);

    const stars = await starsById(id);
    setStars(stars);
    console.log(`stars: ${stars}`);
  }

  const next = async () => {
    if(counter < frankieId) {
      const c = counter + 1;
      const id = frankieId - c;
      console.log(`id: ${id}`);
      getFrankie(id);
      setCounter(c);
      console.log(`c counter: ${c}`);
      setShowId(frankieId - c);
    }
  }

  const prev = async () => {
    if(counter > 1) {
      const c = counter - 1;
      const id = frankieId - c;
      console.log(`id: ${id}`);
      getFrankie(id);
      setCounter(c);
      console.log(`c counter: ${c}`);
      setShowId(frankieId - c);
    }
  }

  return (
    <Container>
      <br/>
      <Row>
        <Col>
        <Button variant="dark" onClick={() => prev()} style={{color: "greenyellow"}}>Previous Frankenstein Text</Button>
        </Col>
        <Col>
        <Button variant="dark" onClick={() => next()} style={{color: "greenyellow"}}>Next Frankenstein Text</Button>
        </Col>
      </Row>
      <br/>
      {
        text && 
        <Card className="shadow-lg p-3 mb-5 bg-white rounded text-center" style={{ width: 'auto', maxWidth: '47rem' }}>
        <Card.Body>
        <Card.Title>
          <h5 style={{color: "lightgray"}}>{`FRANKENSTEIN TEXT NFT ID: ${showId}`}</h5>
        </Card.Title>
        <Card.Text>
        <br/>
        <h5>{text && `"${text}"`}</h5>
        <br/>
        <p style={{color: "lightgray"}}>{stars && `Stars: ${stars}`}</p>
        </Card.Text>
        </Card.Body>
      </Card>
      }

      <Card className="shadow-lg p-3 mb-5 bg-white rounded" style={{ width: 'auto', maxWidth: '47rem' }}>
        <Card.Body>
          <Card.Title>
            <Form inline onSubmit={(e) => getNFT(e)}>
            <Form.Group>
            <Row>
            <Col>
            <Form.Control
              placeholder="NFT Id"
              type="number"
              onChange={e => updateNFTId(e)}
            ></Form.Control>
            </Col>
            <Col>
            <Button variant="dark" type="submit" style={{color: "greenyellow"}}>Get Frankenstein Text by Id</Button>
            </Col>
            </Row>
            </Form.Group>
          </Form>
            </Card.Title>
            <Card.Text>
              
            </Card.Text>
            </Card.Body>
          </Card>
      
      <h5 style={{color: "gray"}}>Feed Mode: users have access to the most recent minted Frankenstein Texts. Users can also search for specific minted Frankenstein Text's Ids.</h5>
      <br/>
    </Container>
  );
}

export default Feed;