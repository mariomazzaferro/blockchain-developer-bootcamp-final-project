import React, { useState, useRef } from 'react';
import { Container, Button, Card, Form, Row, Col } from 'react-bootstrap';

const Ownership = ({ownerOf, balanceOf, transfer}) => {
  const [NFTId, setNFTId] = useState(undefined);
  const [ownerById, setOwnerById] = useState(undefined);
  const [owner, setOwner] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [from, setFrom] = useState(undefined);
  const [to, setTo] = useState(undefined);
  const [tokenId, setTokenId] = useState(undefined);
  const formRef = useRef(null);

  const updateFrom = (e) => {
    const from = e.target.value;
    setFrom(from);
  }

  const updateTo = (e) => {
    const to = e.target.value;
    setTo(to);
  }

  const updateTokenId = (e) => {
    const tokenId = e.target.value;
    setTokenId(tokenId);
  }

  const transferToken = async (e) => {
    e.preventDefault();
    if(from && to && tokenId) {
      try {
        const res = await transfer(from, to, tokenId);
        const resFrom = res.events.Transfer.returnValues[0];
        if(resFrom === from) {
          alert("Token transfer successful");
          setFrom(undefined);
          setTo(undefined);
          setTokenId(undefined);
          formRef.current.reset();
        } else {
          alert("Token transfer failed");
        }
      } catch(err){
        console.log(err.message);
      }
    }
  }

  const updateOwner = (e) => {
    const owner = e.target.value;
    setOwner(owner);
    setBalance(undefined);
  }

  const getBalance = async (e) => {
    e.preventDefault();
    try {
      let balance = await balanceOf(owner);
      setBalance(balance);
    } catch(err){}
  }

  const updateNFTId = (e) => {
    const NFTId = e.target.value;
    setNFTId(NFTId);
    setOwnerById(undefined);
  }

  const getOwner = async (e) => {
    e.preventDefault();
    if(NFTId) {
      let ownerById = await ownerOf(NFTId);
      setOwnerById(ownerById);
    }
  }

  return (
    <Container>
      <br/>
      <Card className="shadow-lg p-3 mb-5 bg-white rounded" style={{ width: 'auto', maxWidth: '57rem' }}>
        <Card.Body>
          <Card.Title>
          <Form inline onSubmit={(e) => getOwner(e)}>
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
            <Button variant="dark" type="submit" className="font-weight-bold" style={{color: "silver"}}>Get Owner Address by NFT Id</Button>
            </Col>
            </Row>
            </Form.Group>
          </Form>
          </Card.Title>
          <Card.Text>
            <h5>{
              (NFTId && ownerById) &&
              `Owner: ${ownerById}`
            }</h5>
          </Card.Text>
        </Card.Body>
      </Card>

      <Card className="shadow-lg p-3 mb-5 bg-white rounded" style={{ width: 'auto', maxWidth: '57rem'}}>
        <Card.Body>
          <Card.Title>
            <Form inline onSubmit={(e) => getBalance(e)}>
            <Form.Group>
            <Row>
            <Col>
            <Form.Control
              placeholder="Address : )"
              type="string"
              onChange={e => updateOwner(e)}
            ></Form.Control>
            </Col>
            <Col>
            <Button variant="dark" type="submit" className="font-weight-bold" style={{color: "silver"}}>Get NFT balance by Owner Address</Button>
            </Col>
            </Row>
            </Form.Group>
          </Form>
            </Card.Title>
            <Card.Text>
            <h5>{
              (owner && balance) &&
              `NFT Balance: ${balance}`
            }</h5>
            </Card.Text>
            </Card.Body>
          </Card>

      <Card className="shadow-lg p-3 mb-5 bg-white rounded" style={{ width: 'auto', maxWidth: '57rem'}}>
        <Card.Body>
          <Card.Title>
            <Form inline ref={formRef} onSubmit={(e) => transferToken(e)}>
            <Form.Group>
            <Row>
            <Col>
            <Form.Control
              placeholder="Address From : ("
              type="string"
              onChange={e => updateFrom(e)}
            ></Form.Control>
            </Col>
            <Col>
            <Form.Control
              placeholder="Address To : )"
              type="string"
              onChange={e => updateTo(e)}
            ></Form.Control>
            </Col>
            <Col>
            <Form.Control
              placeholder="NFT Id : )"
              type="number"
              onChange={e => updateTokenId(e)}
            ></Form.Control>
            </Col>
            <Col>
            <Button variant="dark" type="submit" className="font-weight-bold" style={{color: "silver"}}>Transfer NFT $</Button>
            </Col>
            </Row>
            </Form.Group>
          </Form>
            </Card.Title>
            <Card.Text>
            </Card.Text>
            </Card.Body>
          </Card>
    </Container>
  );
}

export default Ownership;