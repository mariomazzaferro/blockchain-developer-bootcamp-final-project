import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Button, Card, Form, Row, Col } from 'react-bootstrap';

const Feed = ({promptById, counter, commentsById, comment}) => {
  const [cid, setCid] = useState(undefined);
  const [text, setText] = useState(undefined);
  const [comments, setComments] = useState(undefined);
  const [NFTId, setNFTId] = useState(undefined);
  const [showId, setShowId] = useState(undefined);
  const [commText, setCommText] = useState(undefined);
  const formRef = useRef(null);

  useEffect(() => {
    setNFTId(parseInt(counter)+1);
    setText('.../0xe89b7291784c3e6f1cf3297af12935c497ae0ec0(PROMPT): This is an example of the structure of a prompt. Above you will find the unique NFT number id of the current prompt, below you will find the number of comments; which represents the times someone commented the current prompt and created a new NFT from it. .../0x53c7c1f12589564a3d012432aa0b8044eee05db9(COMMENT): When you comment a prompt, the generated NFT will have a structure like this example (original prompt + comment(s)). .../0xe2ad2d1df71a616556d2cf2c72a4ed939c7374d0(COMMENT): Other people can use your comment as a prompt for a new comment, and so on. Click "Next Prompt" and have fun!');
    setComments(0);
    setShowId(0);
  }, [counter]);

  const updateComment = (e) => {
    const comm = e.target.value;
    setCommText(comm);
  }

  const submitComment = async (e) => {
    e.preventDefault();
    const returnedOldCid = await comment(commText, text, cid);
    setCommText(undefined);
    formRef.current.reset();
    console.log(`returnedOldCid: ${returnedOldCid}`);
    console.log(`cid: ${cid}`);
    if(returnedOldCid === cid) {
      alert("Comment minted successfully");
    } else {
      alert("Comment failed");
    }
  }

  const updateNFTId = (e) => {
    const NFTId = e.target.value;
    setNFTId(NFTId);
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
    const comms = await commentsById(cid);
    setComments(comms);
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
        <Col>
          
        </Col>
        <Col></Col>
        <Col>
        <Button variant="dark" onClick={() => next()} className="font-weight-bold" style={{color: "silver"}}>Next Prompt</Button>
        </Col>
      </Row>
      <br/>
      {
        text && 
        <Card className="shadow-lg p-3 mb-5 bg-white rounded text-center" style={{ width: 'auto', maxWidth: '64rem' }}>
        <Card.Body>
        <Card.Title>
          <h5 style={{color: "lightgray"}}>{`PROMPT ID: ${showId}`}</h5>
        </Card.Title>
        <Card.Text>
        <br/>
        <h5>{text && `${text}`}</h5>
        <br/>
        <p style={{color: "lightgray"}}>{`COMMENTS: ${comments}`}</p>
        <br/>
        <Form ref={formRef} onSubmit={(e) => submitComment(e)}>
        <Form.Group>
        <Form.Control
          as="textarea" rows="13"  placeholder="Write your comment...    Once minted, it will become a prompt NFT, and anyone will be able to create new prompts by commenting this one."
          onChange={e => updateComment(e)}
        ></Form.Control>
        <Button variant="dark" type="submit" className="font-weight-bold" style={{color: "silver"}}>Mint Comment</Button>
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
              placeholder="NFT Id"
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
      <br/>
    </Container>
  );
}

export default Feed;