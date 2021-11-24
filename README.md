# CRYPTO PROMPTS

There is a subreddit called <a href="https://www.reddit.com/r/WritingPrompts/">r/WritingPrompts</a>, where millions of writers contribute to create new content. Crypto Prompts is the implementation of that in the Ethereum Blockchain. Where each prompt or ramification is an ERC-721 Non-Fungible Token that can be bought, sold, transfered or used as a prompt for other ramifications.

Crypto Prompts has no owner and no profit. It is a public service, everything you pay here is spent exclusively on blockchain fees. The initial proposal is inspired by Writing Prompts subreddit, with its literary appeal, but there are zero rules here, you can write whatever you want however you want it. There can be question prompts, making the ramification dynamic similar to Quora Digest. There can be discussion prompts, tilting more towards Twitter's dynamic. There are endless possibilities for new prompts, its impossible to guess all of them now, the best way to predict the futere is by writing it.


## Overview

Right now, the millions of <a href="https://www.reddit.com/r/WritingPrompts/">r/WritingPrompts</a> users simply post their prompts and comments (ramifications) on reddit with no way to effectively claim authorship and profit from their creative work. They are using reddit simply as a training ground for their writing skills.

Having said that, the 2 main objectives of this dapp are:
- to attribute ownership to content created through this type of collaboration.
- to empower writers and wannabe-writers, by make their journey more profitable and trackable.

As a reader using Crypto Prompts: you will be able to read every prompt and each of its ramifications (if they exist), as well as search for specific prompts, ramifications or even second order ramifications.
As a writer using Crypto Prompts: you will be able to write new initial prompts and new ramifications for any existing prompt.


## User Workflow

1- User registers on the site (using metamask).<br/>
2- User writes an initial prompt or a ramification prompt and mints it (signed transaction).<br/>
3- User can read other people's prompts and write ramifications of them.<br/>
4- User can read other people's prompts and each of its ramifications.<br/>


## Development

The idea is to have the prompt text stored in IPFS and only the IPFS CIDs stored in the blockchain. The backend is 100% decentralized (IPFS + smart contract).

Crypto Prompt NFTs inherit from OpenZeppelin's ERC-721 standard.

This is a simple dapp, its core functionality implements two mappings: "promptCids" and "ramifications". "promptCids" relates NFT Id to its stored text IPFS CID. "ramifications" relates NFT Id to its list of ramifications.


## Directory structure

- contracts folder - Crypto Prompts smart contract and its respective migration contract.

- frontend folder - Front end code for Crypto Prompts that was built with React.js.

- migrations - Files used for truffle's migration steps.

- test - Folder containing tests for the smart contract written in JavaScript.


## Building and running the project locally

1. Clone this repo to your local environment. Run `git clone https://github.com/mariomazzaferro/blockchain-developer-bootcamp-final-project.git`
2. Enter the repo. Run `cd blockchain-developer-bootcamp-final-project`
3. Install root dependencies. Run `npm install`
4. Run unit tests on default port 9545. Run `truffle test`
5. Enter frontend folder. Run `cd frontend`
6. Install frontend dependencies. Run `npm install`
7. Create .env file inside frontend folder with REACT_APP_NFTSTORAGE_API_KEY = <NFTSTORAGE_API_KEY> (<a href="https://nft.storage/">https://nft.storage/</a>)
8. Once installation is complete, from within the frontend folder run `npm start` to launch the front-end.


## Deployed Application
<a href="https://sharp-bose-58b7c2.netlify.app/">https://sharp-bose-58b7c2.netlify.app/</a>


## Public Ethereum Account

"Please also include your public Ethereum account if you would like to receive your certification as an NFT:" Yes, please. Public Ethereum Account: 0x11111081d8428d4F3A82Ee3D64e8C6350eD4FcB5 
