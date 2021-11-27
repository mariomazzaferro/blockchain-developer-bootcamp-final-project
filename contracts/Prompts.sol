// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

/// @title Contract for minting Prompt NFTs 
/// @author Mario Mazzaferro
/// @notice Allows users to mint Prompt NFTs and manage their IPFS CIDs and ramifications
contract Prompts is ERC721 {

    /// @notice Tracks number of minted Prompts
    uint256 public counter;

    /// @notice Relates Prompt Ids and their respective IPFS CIDs
    mapping(uint256 => string) public promptCids;

    /// @dev Relates Prompt Ids and their respective ramification lists
    mapping(uint256 => uint256[]) public ramifications;

    /// @notice Checks if oldId is an existing prompt
    /// @param oldId Id of the Prompt that is being ramificated
    modifier validOldId(uint oldId) {
      require(oldId <= counter);
      _;
    }

    /// @dev Sets initial values for the ERC-721 standard
    constructor() ERC721("Prompts", "PRP") {}

    /// @dev Effectively mints prompt
    /// @param newCid IPFS CID of the Prompt that is being minted
    function _mintValidPrompt(string calldata newCid) private {
      counter++;
      promptCids[counter] = newCid;
      _safeMint(msg.sender, counter);
    }

    /// @notice Mints prompt
    /// @param newCid IPFS CID of the Prompt that is being minted
    function mintPrompt(string calldata newCid) external {
      _mintValidPrompt(newCid);
    }

    /// @notice Mints ramification prompt
    /// @param newCid IPFS CID of the Prompt that is being minted
    function mintPrompt(string calldata newCid, uint oldId) external validOldId(oldId) {
      _mintValidPrompt(newCid);
      ramifications[oldId].push(counter);
    }

    /// @notice Returns number of ramifications for that specific promptId
    /// @param promptId Id of the specific Prompt
    function promptRamifications(uint promptId) external view validOldId(promptId) returns(uint) {
      return ramifications[promptId].length;
    }
}