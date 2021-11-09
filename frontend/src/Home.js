import React from 'react';
import { Container } from 'react-bootstrap';

const Home = () => {
  
  return (
    <Container>
      <br/>

      <h4>Welcome to Frankenstein Texts!</h4>
      
      <br/>

      <h5>This is a blockchain writing game where you contribute with random people to elaborate a text, and gain the right to title and mint it as a unique Frankenstein Text NFT.</h5>

      <br/>

      <h5>There are no restrictions on what you can write. The text can be a story, a dissertation, a letter, a poem, a recipe… you name it! The important thing to keep in mind is that someone else has to understand what's going on with the text and be able to continue it in an interesting way.</h5>

      <br/>

      <h5>Each text has a fixed amount of 3 co-writers, and each one of them will have 2 hours to write their contribution.</h5>

      <br/>

      <h5>There are two ways to interact with the game:</h5>

      <br/>

      <Container>
      <h5>1-Write: users request a random text to contribute, and have 2 hours to write and submit their contribution. Each contribution is automatically separated with a double slash (//), so be aware, you might have to conclude the text if you are the 3rd co-writer.</h5>

      <br/>

      <h5>2-Mint: users have access to their list of finalized Frankenstein Texts, which they have the right to title and mint only once during the entire week after the 3rd contribution is submitted. The finalized Frankenstein Texts are called Untitled, because… well they have no title yet! You can access your Untitleds through their ids, which start from 0 (your first Untitled text) and increase until your most recent Untitled.</h5>
      </Container>

      <br/>

      <h5>Lastly, each minted Frankenstein Text NFT has a number of stars, ranging from 1 to 3, which represent the number of co-writers that minted the text. You can roughly assume that a higher number of mints indicates a higher quality of text, since more contributors thought it was interesting enough to mint.</h5>

      <br/>

    </Container>
  )
};

export default Home;