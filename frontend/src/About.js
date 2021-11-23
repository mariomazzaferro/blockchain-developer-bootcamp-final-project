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
          <p>There is a subreddit called <a href="https://www.reddit.com/r/WritingPrompts/">r/WritingPrompts</a>, where millions of writers contribute to create new content. Crypto Prompts is the implementation of that in the Ethereum Blockchain. Here, each prompt or ramification is an ERC-721 Non-Fungible Token that can be sold, transfered or used as a prompt for other ramifications.</p>
        </Card.Text>
        </Card.Body>
      </Card>
      <Card className="shadow-lg p-3 mb-5 bg-white rounded text-center" style={{ width: 'auto' }}>
        <Card.Body>
        <Card.Title>
          <h5>ERC-721 NFT STANDARD</h5>
        </Card.Title>
        <Card.Text>
          <p>Non-Fungible Tokens are used to identify something in a unique way, and to securely manage its ownership. This type of Tokens are perfect to be used on platforms that offer collectible items or any other generic items. The ERC-721 is the main standard for NFTs in the crypto industry, the NFTs you create here are compatible with every NFT Marketplace.</p>
        </Card.Text>
        </Card.Body>
      </Card>
      <Card className="shadow-lg p-3 mb-5 bg-white rounded text-center" style={{ width: 'auto' }}>
        <Card.Body>
        <Card.Title>
          <h5>CRYPTO PROMPTS</h5>
        </Card.Title>
        <Card.Text>
          <p>This platform is 100% decentralized, the code is open source and there is no owner, nor profit. Crypto Prompts is a public service, everything you pay here is spent exclusively on blockchain fees. The initial proposal is inspired on Writing Prompts subreddit, with its literary appeal, but there are zero rules here, you can write whatever you want however you want it. There can be question prompts, making the ramification dynamic similar to Quora Digest. There can be discussion prompts, tilting more towards Twitter's dynamic. There are endless possibilities for new prompts, its impossible to guess all of them now, the best way to predict the futere is by writing it.</p>
        </Card.Text>
        </Card.Body>
      </Card>
      <Card className="shadow-lg p-3 mb-5 bg-white rounded text-center" style={{ width: 'auto' }}>
        <Card.Body>
        <Card.Title>
          <h5>IMPLEMENTATIONS</h5>
        </Card.Title>
        <Card.Text>
          <p>Available on: Ethereum Ropsten Testnet.</p>
          <p>Available soon on: Polygon, Binance and Ethereum Mainnet.</p>
        </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default About;