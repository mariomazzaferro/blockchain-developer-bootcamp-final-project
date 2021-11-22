## Design pattern decisions

1. Inter-Contract Execution: Does not apply.

2. Inheritance and Interfaces: Prompts.sol inherits from openzeppelin's ERC721 for its NFT functionality.

3. Oracles: Does not apply.

4. Access Control Design Patterns: Does not apply.

5. Upgradable Contracts: Does not apply.

6. Optimizing Gas: Prompts.sol usability have been designed to cost as little as possible. The prompts' text data is stored on IPFS and only the essential pointers and logic are stored in the smart contract. The "costly functionality" has been isolated from the "view functionality", so the users that are only readers have a free expecience.