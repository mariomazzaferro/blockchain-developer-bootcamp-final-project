# Project Name: CRYPTO PROMPTS

There is a subreddit called <a href="https://www.reddit.com/r/WritingPrompts/">r/WritingPrompts</a>, where millions of writers contribute to create new content. Crypto Prompts is the implementation of that idea in the blockchain. Where each prompt and ramification are ERC-721 Non-Fungible Tokens that can be bought, sold, transfered or used as a prompts for other ramifications.


## Overview

Right now, the millions of <a href="https://www.reddit.com/r/WritingPrompts/">r/WritingPrompts</a> users simply post their prompts and comments (ramifications) on reddit with no way to effectively claim authorship and profit from their creative work. They are using reddit simply as a training ground for their writing skills.

Having said that, the 2 main objectives of this dapp are:
- to attribute ownership to content created through this type of collaboration.
- to empower writers and wannabe-writers, by making their journey more profitable and trackable.

Crypto Prompts has no owner and seeks no profit. It is a public service, everything you pay in this platform is spent exclusively on blockchain fees. The initial proposal is inspired by Writing Prompts subreddit, with its literary appeal, but there are no rules here, you can write whatever you want, however you want it. There can be question prompts, making the ramification dynamic similar to Quora, there can be discussion prompts, tilting it more towards Twitter's dynamic. There are endless possibilities for new prompts, its impossible to guess all of them now, the best way to predict the futere is by writing it.

As a reader using Crypto Prompts: you will be able to read every prompt and each of its ramifications, as well as search for specific prompts and ramifications.
As a writer using Crypto Prompts: you will be able to write new initial prompts and new ramifications for any existing prompt.


## User Workflow

1- User registers on the site (using metamask).<br/>
2- User writes an initial prompt or a ramification prompt and mints it (signed transaction).<br/>
3- User can read other people's prompts and write ramifications of them.<br/>
4- User can read other people's prompts and each of its ramifications.<br/>


## Development

The prompt texts are stored in IPFS and only the IPFS CIDs are stored in the blockchain. The backend is 100% decentralized (IPFS + smart contract).

Crypto Prompt NFTs inherit from OpenZeppelin's ERC-721 standard.

This is a simple dapp, its core functionality implements two mappings: "promptCids" (relates NFT Id to its IPFS CID) and "ramifications" (relates NFT Id to its list of ramifications).


## Directory structure

- contracts folder - Crypto Prompts smart contract and its respective migration contract.

- frontend folder - Front end code for Crypto Prompts that was built with React.js.

- migrations - Files used for truffle's migration steps.

- test - Folder containing tests for the smart contract written in JavaScript.


## Building and running the project locally

1. Clone this repo to your local environment. Run `git clone https://github.com/mariomazzaferro/blockchain-developer-bootcamp-final-project.git`
2. Enter the repo. Run `cd blockchain-developer-bootcamp-final-project`
3. Install root dependencies. Run `npm install`
4. Initialize Ganache. Run `truffle develop`
5. Run unit tests on default port 9545. Run `truffle test`
6. Deploy contracts locally. Run `truffle migrate --reset`
7. Open a NEW terminal tab and enter frontend folder. Run `cd frontend`
8. Install frontend dependencies. Run `npm install`
9. Create .env file inside frontend folder with REACT_APP_NFTSTORAGE_API_KEY = <NFTSTORAGE_API_KEY> (you can create a new NFT Storage API Key on <a href="https://nft.storage/">https://nft.storage/</a>)
10. Once installation is complete, from within the frontend folder run `npm start` to launch the front-end.


## Deployed Application
https://sharp-bose-58b7c2.netlify.app/


## Screencast link
https://www.loom.com/share/ead28f81d6c249d48689f1a84b23192e


## My ethereum adress for the NFT certificate
    0x11111081d8428d4F3A82Ee3D64e8C6350eD4FcB5 

## Future Improvements

In the future, by integrating Moralis to this project it will be possible to exclude the ramifications mapping and include a MintedPrompt(uint newId, string newCid, uint oldId) event that would be fired on every mint. This change creates a Moralis backend that records and organizes the historical data of Crypto Prompts making it more accessible and rich. Moralis' back end will also allow purely off-chain functionalities (upvoting prompts, commenting prompts, etc).