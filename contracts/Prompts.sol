// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

/// @title A writing propts dapp
/// @author Mario Mazzaferro
contract Prompts is ERC721 {

    /// @dev Keeps track of the number of minted Prompts.
    uint256 public counter;

    /// @dev Fired upon successful mintPrompt() call.
    event MintedPrompt(uint promptId, string promptCid, uint parentPromptId);

    /// @dev Order of Prompts represented by their respective IPFS CIDs.
    mapping(uint256 => string[]) public promptOrder;

    /// @dev Checks if oldCid is valid.
    modifier validOldId(uint oldId) {
      require(promptOrder[oldId].length != 0);
      _;
    }

    /// @dev Sets initial values.
    constructor() ERC721("Prompts", "PRP") {
    }

    function _mintValidPrompt(string calldata newCid) private {
      counter++;
      promptOrder[counter] = [newCid];
      _safeMint(msg.sender, counter);
    }

    function mintPrompt(string calldata newCid) external {
      _mintValidPrompt(newCid);
      emit MintedPrompt(counter, newCid, counter);
    }

    function mintPrompt(string calldata newCid, uint oldId) external validOldId(oldId) {
      _mintValidPrompt(newCid);
      promptOrder[oldId].push(newCid);
      emit MintedPrompt(counter, newCid, oldId);
    }

    function promptRamifications(uint promptId) external view validOldId(promptId) returns(uint) {
      return promptOrder[promptId].length - 1;
    }
}