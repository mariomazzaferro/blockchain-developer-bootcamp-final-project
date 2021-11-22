import React from 'react';
import { Container, Card } from 'react-bootstrap';

const About = () => {
  return (
    <Container>
      <br/>
      <Card className="shadow-lg p-3 mb-5 bg-white rounded text-center" style={{ width: 'auto' }}>
        <Card.Body>
        <Card.Title>
          <h5>WRITING PROMPTS</h5>
        </Card.Title>
        <Card.Text>
          <p>There is a subreddit called <a href="https://www.reddit.com/r/WritingPrompts/">r/WritingPrompts</a>, where millions of writers contribute to create new content. Crypto Prompts is the implementation of that in the Ethereum Blockchain. Where each prompt or ramification is an ERC-721 Non-Fungible Token that can be bought, sold, transfered or used as a prompt for other ramifications.</p>
        </Card.Text>
        </Card.Body>
      </Card>
      <Card className="shadow-lg p-3 mb-5 bg-white rounded text-center" style={{ width: 'auto' }}>
        <Card.Body>
        <Card.Title>
          <h5>ERC-721 NFT STANDARD</h5>
        </Card.Title>
        <Card.Text>
          <p>A Non-Fungible Token are used to identify something in a unique way, and to securely manage its ownership. This type of Token are perfect to be used on platforms that offer collectible items or any other generic items really. The ERC-721 is the main standard for NFTs in the crypto industry, the NFTs you create here are compatible with every major NFT Marketplace.</p>
        </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default About;