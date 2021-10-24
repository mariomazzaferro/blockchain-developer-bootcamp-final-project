# Frankenstein Texts

At school in Brazil, during our English classes, we used to play a game: everybody should start writing a text (in English), it could be anything; a story, a dissertation, a letter to the president, a poem, etc. After a while the teacher would give a signal and all the students would pass their text to the right, get the text from someone else, read it and continue the other student’s text in the best way possible, until the next signal from the teacher and so on. The texts would usually end up with 20 to 30 lines and 4 to 6 co-writers. In the end it was always fun to see how the texts unrolled into pearls of creativity or just nonsense.

For the Final Project I wish to implement a version of this game on the blockchain, where different random addresses contribute to write a text and gain the opportunity to title and mint the final "Frankenstein Text" as a unique NFT.

# Overview

The Frankenstein Text will have a fixed number of 5 co-writers. There should be a maximum amount of time for each individual contribution, probably 2 to 3 hours.

As a writer, you will be given a random text to contribute, it might be a text with already some contributions or even the opportunity to start a text from scratch. After all 5 contributions are concluded, for a couple of days each co-writer has the opportunity to title and mint the text as a unique NFT.

The Frankenstein Text NFT will have a number of mints associated to it, ranging from 1 to 5, which will represent the number of co-writers that minted the text. One would imagine that a higher number of mints indicates a higher quality of text, since more contributors thought the text was interesting enough to mint.

There will be two ways to interact with the game:

Write – users request a pseudo-random text to contribute, have 2 hours to write and submit their contribution.

Mint – users have access to their list of finalized Frankenstein Texts that they can title and mint for a limited amount of time after the 5th contribution.

# User Workflow

WRITE MODE:<br/>
1- User registers on the site (using metamask).<br/>
2- User requests to write.<br/>
3- User receives a random text to contribute.<br/>
4- User contributes to the random text and submits the contribution (signed transaction).<br/>
5- After the 5th contribution, each co-writer is notified that the text is finished and for the next couple of days they have the opportunity to title and mint it as a unique Frankenstein Text NFT.<br/>

MINT MODE:<br/>
1- User registers on the site (using metamask).<br/>
2- User enters Mint Mode (after some contributions, the user should have a list of possible Frankenstein Texts to title and mint).<br/>
3- User titles the Frankenstein Text of choice and mints it.

# Development

The initial idea is to have the individual contributions stored in IPFS and only the IPFS CIDs stored in the blockchain. The backend should be 100% decentralized (IPFS + smart contract).

Frankenstein Text NFTs should follow the ERC-721 standard.

A pain point for developing this game is the randomness aspect of it. Using Chainlink Random Number Generator solves this, but it's also an overkill, and it would make the game expensive to play.<br/>
Instead, the initial approach is to implement a pseudo-random functionality that makes it unfeasible for dishonest players to successfully and consistently receive specific desired texts to contribute.

# Future Improvements (outside the scope of this final project)

Once the basic functionality explained above is implemented, the next step will be to create a generative art character collection called Frankenstein Mugshots. This collection will associate a unique art to each minted Frankenstein Text. It should algorithmicly generate Frankenstein Mugshots based on Frankenstein Texts' data, and have a number of stars in it representing the number of mints.
