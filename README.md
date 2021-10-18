# Frankenstein Texts
As a teenager, learning English in Brazil, our teacher used to make us play a game: everybody should start writing a text (in English), it could be anything; a story, a dissertation, a letter to the president, a poem, etc. After a while the teacher would give a signal and all the students would pass their text to the right, get the text from someone else, read it and continue the other student’s text in the best way possible, until the next signal from the teacher and so on. The texts would usually end up with 20 to 30 lines and 4 to 6 co-writers. In the end it was always fun to see how the texts unrolled into pearls of creativity or just nonsense.

For the Final Project I wish to implement a version of this game on the blockchain, where different random addresses contribute to write a text and gain the opportunity to title and mint the final "Frankenstein Text" as a unique NFT.

# Overview
The Frankenstein Text will have a fixed number of 5 co-writers, each one contributing with at least 100 characters, but no more than 1000 characters. There should be a maximum amount of time for each individual contribution, probably 2 hours.

As a writer, you will be pseudo-randomly given a text to contribute, this might be a text with already some contributions or even the opportunity to start a text from scratch. After all 5 contributions are concluded, for a couple of days each co-writer has the opportunity to title and mint the text as a unique NFT.

The Frankenstein Text NFT will have a number of mints associated to it, which will be the number of co-writers that minted the text. One would imagine that a higher number of mints indicates a higher quality of text, since more contributors thought the text was interesting enough to mint.

There will be two modes to interact with the game: 

  Write Mode – users request a pseudo-random text to contribute, have 2 hours to write and submit their contribution.
  
  Mint Mode – users have access to their list of finalized Frankenstein Texts that they can title and mint for a limited amount of time after the 5th contribution.

# User Workflow

WRITE MODE:<br/>
1- User registers on the site (using metamask).<br/>
2- User requests to write.<br/>
3- As a response to the request to write: user receives a random text to contribute.<br/>
4- User contributes (writes at least 100 characters and no more then 1000) to the random text and submits the contribution (signed transaction).<br/>
5- After the 5th contribution, each co-writer is notified that the text is finished and for the next couple of days they have the opportunity to title and mint it as a unique Frankenstein Text NFT.<br/>
6- User gets tired of saying Frankenstein Text NFTs and starts calling them just "Frankies".

MINT MODE:<br/>
1- User registers on the site (using metamask).<br/>
2- User enters Mint Mode (after some contributions, the user should have a list of possible Frankies to title and mint).<br/>
3- User titles the Frankie of choice and mints it.

# Development

The initial idea is to have the individual contributions stored in IPFS and only the IPFS hashes stored in the blockchain. This way, the architecture of the DApp becomes straightforward and decentralized: a simple frontend that talks to a decentralized backend (IPFS + smart contract).

Frankies should follow the ERC-721 standard.

A pain point for developing this game is the randomness aspect of it. Using Chainlink Random Number Generator could solve this but it feels like an overkill, and it would make the game expensive to play.<br/>
Instead, the initial approach is to implement a pseudo-random enough functionality that at least makes it unfeasible for dishonest players to successfully and consistently receive specific desired texts to contribute.

# Future Improvements (outside the scope of the final project)

Once the basic functionality explained above is implemented, the next step will be to create a generative art character collection called Frankenstein Mugshots. This collection will associate a unique art to each minted Frankenstein Text. It should algorithmicly generate Frankenstein Mugshots based on Frankenstein Texts' data.