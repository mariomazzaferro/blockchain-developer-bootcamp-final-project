## Design pattern decisions

1. Inter-Contract Execution: Does not apply, Prompts.sol makes no external contract calls.

2. Inheritance and Interfaces: Prompts.sol inherits from openzeppelin's ERC721 contract for its NFT functionality.

3. Oracles: Does not apply, no Oracle needed.

4. Access Control Design Patterns: Does not apply, no access control needed.

5. Upgradable Contracts: Does not apply, no upgradable functionality needed.

6. Optimizing Gas: Prompts.sol usability have been designed to cost as little as possible. The prompts' text data are stored on IPFS and only the essential pointers and logic are stored in the smart contract. The "costly functionality" has been isolated from the "view functionality", so the users that are only readers have a free expecience. Future improvements are planned to lower gas costs even more by: 
- integrating Moralis (to listen and record fired events, will be a cheaper and more accessible way to store historical data for the dapp)
- implementing an event called MintedPrompt(uint newId, string newCid, uint oldId) that will be fired on every mint
- excluding the ramifications mapping (this data will be recorded by fired events and organized on Moralis backend)