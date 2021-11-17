import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Card, Form, Row, Col } from 'react-bootstrap';

const Feed = ({promptById, counter, commentsById, comment}) => {
  const [cid, setCid] = useState(undefined);
  const [text, setText] = useState(undefined);
  const [comments, setComments] = useState(undefined);
  const [NFTId, setNFTId] = useState(undefined);
  const [showId, setShowId] = useState(undefined);
  const [commText, setCommText] = useState(undefined);

  useEffect(() => {
    setNFTId(counter);
    setShowId(counter);
  }, [counter]);

  const updateNFTId = (e) => {
    const NFTId = e.target.value;
    setNFTId(NFTId);
  }

  const getNFT = async (e) => {
    e.preventDefault();
    console.log(NFTId);
    if(NFTId && 0 < NFTId && NFTId <= parseInt(counter)) {
      getPrompt(NFTId);
    }
  }

  const getPrompt = async (id) => {
    const cid = await promptById(id);
    setCid(cid);
    console.log(`cid: ${cid}`);

    const blob = await axios.get(`https://ipfs.io/ipfs/${cid}`);
    setText(blob.data);
    console.log(`text: ${blob.data}`);
    const comms = await commentsById(cid);
    setComments(comms);
    setShowId(id);
  }

  const next = async () => {
    if(!text && NFTId === counter) {
      await getPrompt(NFTId);
    } else if(1 < NFTId) {
      const c = NFTId - 1;
      console.log(`NFTId: ${c}`);
      setNFTId(c);
      await getPrompt(c);
    }
  }

  const prev = async () => {
    if(NFTId < counter) {
      const c = NFTId + 1;
      console.log(`NFTId: ${NFTId}`);
      setNFTId(c);
      getPrompt(c);
    }
  }

  return (
    <Container>
      <br/>
      <Row>
        <Col>
        <Button variant="dark" onClick={() => prev()} style={{color: "greenyellow"}}>Previous Prompt</Button>
        </Col>
        <Col>
        <Button variant="dark" onClick={() => next()} style={{color: "greenyellow"}}>Next Prompt</Button>
        </Col>
      </Row>
      <br/>
      {
        text && 
        <Card className="shadow-lg p-3 mb-5 bg-white rounded text-center" style={{ width: 'auto', maxWidth: '47rem' }}>
        <Card.Body>
        <Card.Title>
          <h5 style={{color: "lightgray"}}>{`PROMPT ID: ${showId}`}</h5>
        </Card.Title>
        <Card.Text>
        <br/>
        <h5>{text && `"${text}"`}</h5>
        <br/>
        <p style={{color: "lightgray"}}>{comments && `Comments: ${comments}`}</p>
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
            <Button variant="dark" type="submit" style={{color: "greenyellow"}}>Get Prompt by Id</Button>
            </Col>
            </Row>
            </Form.Group>
          </Form>
            </Card.Title>
            <Card.Text>
              
            </Card.Text>
            </Card.Body>
          </Card>
      <br/>
    </Container>
  );
}

export default Feed;