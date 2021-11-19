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
          <p>There is a subreddit called <a href="https://www.reddit.com/r/WritingPrompts/">r/WritingPrompts</a>, where millions of writers and readers contribute to create new content. Writing NFT Prompts is the implementation of that in the Ethereum Blockchain. Where each prompt or "comment" (ramification) is a ERC-721 Non-Fungible Token that can be bought, sold, transfered or even used as a prompt for other NFT ramifications.</p>
        </Card.Text>
        </Card.Body>
      </Card>
      <Card className="shadow-lg p-3 mb-5 bg-white rounded text-center" style={{ width: 'auto' }}>
        <Card.Body>
        <Card.Title>
          <h5>ERC-721 NFT STANDARD</h5>
        </Card.Title>
        <Card.Text>
          <p>A Non-Fungible Token is used to identify something in a unique way, and to securely manage its ownership. This type of Token is perfect to be used on platforms that offer collectible items or any other generic items really. The ERC-721 is the main standard for NFTs in the crypto industry, for that reason: the NFTs you create here are compatible and can be traded in any NFT Marketplace.</p>
        </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default About;