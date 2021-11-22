// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

/// @title A writing propts dapp
/// @author Mario Mazzaferro
contract Prompts is ERC721 {

    /// @dev Keeps track of the number of minted Prompts.
    uint256 public counter;

    /// @dev Prompts Ids and their respective IPFS CIDs.
    mapping(uint256 => string) public promptCids;

    /// @dev Prompts Ids and their respective lists of ramifications.
    mapping(uint256 => uint256[]) public ramifications;

    /// @dev Checks if oldId is valid.
    modifier validOldId(uint oldId) {
      require(oldId <= counter);
      _;
    }

    /// @dev Sets initial values.
    constructor() ERC721("Prompts", "PRP") {
    }

    /// @dev Effectively mints prompt.
    function _mintValidPrompt(string calldata newCid) private {
      counter++;
      promptCids[counter] = newCid;
      _safeMint(msg.sender, counter);
    }

    /// @dev Mints initial prompt.
    function mintPrompt(string calldata newCid) external {
      _mintValidPrompt(newCid);
    }

    /// @dev Mints ramification prompt.
    function mintPrompt(string calldata newCid, uint oldId) external validOldId(oldId) {
      _mintValidPrompt(newCid);
      ramifications[oldId].push(counter);
    }

    /// @dev Returns number of ramifications for that specific promptId.
    function promptRamifications(uint promptId) external view validOldId(promptId) returns(uint) {
      return ramifications[promptId].length;
    }
}