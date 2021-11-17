// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

/// @title A writing propts dapp
/// @author Mario Mazzaferro
contract Prompts is ERC721 {

    /// @dev Keeps track of the number of minted Prompts.
    uint256 public counter;

    /// @dev Fired upon successful mintPrompt() call.
    event MintedPrompt(uint promptId, string promptCid);

    /// @dev Relates Prompt CIDs with its list of comment CIDs.
    mapping(string => string[]) public prompts;

    /// @dev Order of Prompts represented by their respective IPFS CIDs.
    mapping(uint256 => string) public promptOrder;

    /// @dev Checks if newCid is valid.
    modifier validNewCid(string calldata newCid) {
      require(prompts[newCid].length == 0);
      _;
    }

    /// @dev Checks if newCid is valid.
    modifier validOldCid(string calldata oldCid) {
      require(prompts[oldCid].length != 0);
      _;
    }

    /// @dev Sets initial values.
    constructor() ERC721("Prompts", "PRP") {}

    function _mintValidPrompt(string calldata newCid) private {
      prompts[newCid] = [newCid];
      counter++;
      _safeMint(msg.sender, counter);
      emit MintedPrompt(counter, newCid);
      promptOrder[counter] = newCid;
    }

    function mintPrompt(string calldata newCid) external validNewCid(newCid) {
      _mintValidPrompt(newCid);
    }

    function mintPrompt(string calldata newCid, string calldata oldCid) external validNewCid(newCid) validOldCid(oldCid) {
      _mintValidPrompt(newCid);
      prompts[oldCid].push(newCid);
    }

    function promptComments(string calldata promptCid) external view validOldCid(promptCid) returns(uint) {
      return prompts[promptCid].length - 1;
    }

    function promptCommentById(string calldata promptCid, uint commentId) external view validOldCid(promptCid) returns(string memory) {
      require(commentId < prompts[promptCid].length);
      return prompts[promptCid][commentId];
    }
}