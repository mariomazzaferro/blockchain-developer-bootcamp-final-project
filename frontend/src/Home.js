import React from 'react';
import { Container } from 'react-bootstrap';

const Home = () => {
  
  return (
    <Container>
      <br/>

      <h4>Welcome to Frankenstein Texts!</h4>
      
      <br/>

      <h4>This is a blockchain writing game where you contribute with random people to elaborate a text, and gain the right to title and mint it as a unique Frankenstein Text NFT.</h4>

      <br/>

      <h4>There are no restrictions on what you can write. The text can be a story, a dissertation, a letter, a poem, a recipe… you name it! The important thing to keep in mind is that someone else has to understand what's going on with the text and be able to continue it in an interesting way.</h4>

      <br/>

      <h4>Each text has a fixed amount of 3 co-writers, and each one of them will have 2 hours to write their contribution.</h4>

      <br/>

      <h4>Lastly, each minted Frankenstein Text NFT has a number of stars, ranging from 1 to 3, which represent the number of co-writers that minted the text. You can roughly assume that a higher number of mints indicates a higher quality of text, since more contributors thought it was interesting enough to mint.</h4>

      <br/>

    </Container>
  )
};

export default Home;