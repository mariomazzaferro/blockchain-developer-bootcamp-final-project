## Design pattern decisions

1. Inter-Contract Execution: Does not apply.

2. Inheritance and Interfaces: FrankieTexts.sol inherits from openzeppelin's ERC721 and Ownable for its NFT and access control functionality respectively.

3. Oracles: An oracle could have been used for returning the random Frankenstein Texts to the user. But, it would have been an overkill, making the game too expensive to play. Since there is little incentive to hack the randomness of this game, it has been implemented a robust pseudo-random functionality instead of the oracle.

4. Access Control Design Patterns: FrankieTexts.sol inherits from openzeppelin's Ownable for its access control functionality. Which gets used in seedPlot() and seedBlankPlot(), besides Ownable's own functions.

5. Upgradable Contracts: FrankieTexts.sol does have some upgradability, but is still very limited. The owner can transfer ownership of the contract.

6. Optimizing Gas: FrankieTexts.sol gameplay have been designed to cost as little as possible for the writer/player. Most of the data is stored on IPFS and only the essential pointers and logic are stored in the smart contract. The "costly functionality" has been isolated from the "view functionality", so the gameplay becomes cheaper.