// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/// @title A Frankenstein Texts writing game
/// @author Mario Mazzaferro
contract FrankieTexts is ERC721, Ownable {

    /// @dev Keeps track of the number of requestText() calls.
    uint256 private requestCounter;

    /// @dev Keeps track of the number of CIDs fed in the deck mapping.
    uint256 public feedCounter;

    /// @dev Keeps track of the number of valid submitText() calls.
    uint256 public submitCounter;

    /// @dev Keeps track of the number of plots seeded in the deck.
    uint256 public deckCounter;

    /// @dev Maximum size of the deck mapping.
    uint256 public deckSize;

    /// @dev Keeps track of the number of minted NFTs.
    uint256 public frankieId;

    /// @dev Fired upon requestText() call.
    event RequestedText(string chosenCid, uint256 writerNumber, address requester);

    /// @dev Fired upon mintFrankie() call.
    event MintedFrankie(uint indexed nftId, string nftCid, string indexed fifthCid);

    /// @dev Stores data of a Frankenstein Text.
    struct Frankie {
      string[] cids;
      address[] writers;
    }

    /// @dev Stores temporary data of a Frankenstein Text being edited.
    struct MiniFrankie {
      string cid;
      uint256 editSince;
      uint256 deckNumber;
    }

    /// @dev Relates IPFS CIDs with Frankenstein Texts.
    mapping(string => Frankie) private frankies;

    /// @dev Cue order of IPFS CIDs from incomplete Frankenstein Texts.
    mapping(uint256 => string) private cidOrder;

    /// @dev Relates writer address and current editing Frankenstein Text.
    mapping(address => MiniFrankie) private editing;

    /// @dev Ordered IPFS CIDs that will be pseudo-randomly returned by requestText().
    mapping(uint256 => string) private deck;

    /// @dev Relates writer address with its list of finished untitled Frankenstein Text's CIDs.
    mapping(address => string[]) private untitledTexts;

    /// @dev Relates frankieId with its respective IPFS CID.
    mapping(uint256 => string) private mintedCids;

    /// @dev Keeps track of plots that have had at least one ramification finished.
    mapping(string => bool) private plotEnded;

    /// @dev Sets initial values.
    constructor(uint _deckSize) ERC721("Frankies", "FKE") {
        requestCounter = 0;
        feedCounter = 0;
        submitCounter = 0;
        deckCounter = 0;
        frankieId = 0;
        deckSize = _deckSize;
    }

    /// @dev Updates Frankenstein Text data stored in Frankie struct.
    function _updateFrankie(string calldata newCid, string calldata oldCid) private {
        frankies[newCid] = frankies[oldCid];
        frankies[newCid].cids.push(newCid);
        frankies[newCid].writers.push(msg.sender);
    }

    /// @dev Feeds finished Frankenstein Text into each writer's untitled list.
    /// @dev Feeds a new CID into the deck to replace the finished Frankenstein Text's CID.
    /// @dev If it's the first ramification of that plot to finish: feeds a blank plot CID.
    /// @dev Else: feeds the next CID in the cidOrder cue.
    function _endFrankie(string calldata newCid) private {
      for (uint256 i = 0; i < 3; i++) {
        untitledTexts[frankies[newCid].writers[i]].push(newCid);
      }
      if(!plotEnded[frankies[newCid].cids[0]]) {
        string memory startCid = string(abi.encodePacked(newCid, '000'));
        string[] memory cids;
        address[] memory writers;
        frankies[startCid] = Frankie(cids, writers);
        deck[editing[msg.sender].deckNumber] = startCid;
        plotEnded[frankies[newCid].cids[0]] = true;
      } else {
        deck[editing[msg.sender].deckNumber] = cidOrder[feedCounter];
        unchecked { feedCounter++; } 
        }
    }

    /// @dev Draws a pseudo-random CID from deck mapping.
    /// @dev Sets pseudo-random CID to msg.sender in editing mapping.
    function requestText() external {
      uint256 random = uint256(keccak256(abi.encodePacked(msg.sender, block.difficulty, cidOrder[feedCounter], cidOrder[submitCounter], requestCounter))) % deckSize;
      unchecked { requestCounter++; }
      editing[msg.sender] = MiniFrankie(deck[random], block.timestamp, random);
      emit RequestedText(deck[random], frankies[deck[random]].writers.length, msg.sender);
    }

    /// @dev Updates Frankenstein Text data through _updateFrankie().
    /// @dev If the Frankie has 5 contributions: finalizes Frankenstein Text.
    /// @dev Else: sets newCid in the end of cidOrder cue and if it's the first submited
    /// @dev ramification of oldCid: substitutes it (in the deck) with the first CID of cidOrder cue.
    function submitText(string calldata oldCid, string calldata newCid) external {
      require(editing[msg.sender].editSince + 2 hours > block.timestamp);
      require(keccak256(abi.encodePacked(editing[msg.sender].cid)) == keccak256(abi.encodePacked(oldCid)));
      _updateFrankie(newCid, oldCid);
      if (frankies[newCid].writers.length == 3) {
        _endFrankie(newCid);
      } else {
        cidOrder[submitCounter] = newCid;
        unchecked { submitCounter++; }
        if(keccak256(abi.encodePacked(deck[editing[msg.sender].deckNumber])) == keccak256(abi.encodePacked(oldCid))) {
          deck[editing[msg.sender].deckNumber] = cidOrder[feedCounter];
          unchecked { feedCounter++; }
        }
      }
    }

    /// @dev Checks if the untitled Frankenstein Text is still valid and is owned by the caller.
    /// @dev Updates Frankenstein Text data through _updateFrankie().
    /// @dev Mints Frankenstein Text NFT and delete respective untitled from untitledTexts.
    function mintFrankie(string calldata oldCid, string calldata newCid, uint untitledId) external {
        require(keccak256(abi.encodePacked(oldCid)) == keccak256(abi.encodePacked(untitledTexts[msg.sender][untitledId])));
        _updateFrankie(newCid, oldCid);
        _safeMint(msg.sender, frankieId);
        delete untitledTexts[msg.sender][untitledId];
        mintedCids[frankieId] = newCid;
        emit MintedFrankie(frankieId, newCid, oldCid);
        frankieId++;
    }

    /// @dev Returns NFT CID corresponding to the id parameter.
    function mintedCidById(uint id) external view returns(string memory) {
      require(id < frankieId);
      return mintedCids[id];
    }

    /// @dev Returns newest untitled text id for the caller.
    function requestNewestUntitledId() external view returns(uint) {
        require(untitledTexts[msg.sender].length > 0);
        return untitledTexts[msg.sender].length - 1;
    }

    /// @dev Returns caller's untitled CID with the id of the untitledId parameter.
    function requestUntitledText(uint untitledId) external view returns(string memory) {
        return untitledTexts[msg.sender][untitledId];
    }

    /// @dev Checks if the caller is victor.
    /// @dev Creates an new Frankie with the cid parameter.
    /// @dev If the deck is incomplete: feeds cid into deck.
    /// @dev Feeds cid in the cidOrder cue.
    function seedPlot(string calldata cid) external onlyOwner() {
        string[] memory cids;
        address[] memory writers;
        frankies[cid] = Frankie(cids, writers);
        frankies[cid].cids.push(cid);
        frankies[cid].writers.push(msg.sender);
        if(deckCounter < deckSize) {
          deck[deckCounter] = cid;
          unchecked { feedCounter++; }
          deckCounter++;
        }
        cidOrder[submitCounter] = cid;
        unchecked { submitCounter++; }
    }
}