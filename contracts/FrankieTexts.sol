pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

/// @title A Frankenstein Texts writing game
/// @author Mario Mazzaferro
contract FrankieTexts is ERC721 {

    // Keeps track of the number of requestText() calls.
    uint256 private requestCounter;

    // Keeps track of the number of CIDs fed in the deck mapping.
    uint256 public feedCounter;

    // Keeps track of the number of valid submitText() calls.
    uint256 public submitCounter;

    // Keeps track of the number of plots seeded in the deck.
    uint256 public deckCounter;

    // Maximum size of the deck mapping.
    uint256 public deckSize;

    // Keeps track of the number of minted NFTs.
    uint256 public frankieId;

    // Address that deployed this contract.
    address public victor;

    // Fired upon requestText() call.
    event RequestedText(string chosenCid, address requester);

    // Fired upon mintFrankie() call.
    event MintedFrankie(uint indexed nftId, string nftCid, string indexed fifthCid);

    // Stores data of a Frankenstein Text.
    struct Frankie {
      string[] cids;
      address[] writers;
      uint256 endedSince;
    }

    // Stores temporary data of a Frankenstein Text being edited.
    struct MiniFrankie {
      string cid;
      uint256 editSince;
      uint256 deckNumber;
    }

    // Relates IPFS CIDs with Frankenstein Texts.
    mapping(string => Frankie) public frankies;

    // Cue order of IPFS CIDs from incomplete Frankenstein Texts.
    mapping(uint256 => string) private cidOrder;

    // Relates writer address and current editing Frankenstein Text.
    mapping(address => MiniFrankie) private editing;

    // Ordered IPFS CIDs that will be pseudo-randomly returned by requestText().
    mapping(uint256 => string) private deck;

    // Relates writer address with its list of finished untitled Frankenstein Text's CIDs.
    mapping(address => string[]) public untitledTexts;

    // Relates frankieId with its respective IPFS CID.
    mapping(uint256 => string) public mintedCids;

    // Keeps track of plots that have had at least one ramification finished.
    mapping(string => bool) private plotEnded;

    // Sets initial values.
    constructor() ERC721("Frankies", "FKE") {
        requestCounter = 0;
        feedCounter = 0;
        submitCounter = 0;
        deckCounter = 0;
        deckSize = 10;  //Production:100 / Testing:10
        frankieId = 0;
        victor = msg.sender;
    }

    // Limits access only to victor.
    modifier isVictor() {
        require(msg.sender == victor);
        _;
    }

    // Guarantees that the submitText() caller had previously received that CID less than 2 hours ago.
    modifier isValid(string calldata oldCid) {
        require(keccak256(abi.encodePacked(editing[msg.sender].cid)) == keccak256(abi.encodePacked(oldCid)));
        require(editing[msg.sender].editSince + 2 hours > block.timestamp);
        _;
    }

    // Updates Frankenstein Text data stored in Frankie struct.
    function _updateFrankie(string calldata newCid, string calldata oldCid) private {
        frankies[newCid] = frankies[oldCid];
        frankies[newCid].cids.push(newCid);
        frankies[newCid].writers.push(msg.sender);
    }

    // Feeds finished Frankenstein Text into each writer's untitled list.
    // Feeds a new CID into the deck to replace the finished Frankenstein Text's CID.
    // If it's the first ramification of that plot to finish: feeds a blank plot CID.
    // Else: feeds the next CID in the cidOrder cue.
    function _endFrankie(string calldata newCid) private {
      frankies[newCid].endedSince = block.timestamp;
      for (uint256 i = 0; i < 5; i++) {
        untitledTexts[frankies[newCid].writers[i]].push(newCid);
      }
      if(!plotEnded[frankies[newCid].cids[0]]) {
        string memory startCid = string(abi.encodePacked(newCid, '00000'));
        string[] memory cids;
        address[] memory writers;
        frankies[startCid] = Frankie(cids, writers, 0);
        deck[editing[msg.sender].deckNumber] = startCid;
        plotEnded[frankies[newCid].cids[0]] = true;
      } else {
        deck[editing[msg.sender].deckNumber] = cidOrder[feedCounter];
        unchecked { feedCounter++; } 
        }
    }

    // Draws a pseudo-random CID from deck mapping.
    // Sets pseudo-random CID to msg.sender in editing mapping.
    function requestText() public {
      //Production -----------------------------------------------------------
      uint256 random = uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, cidOrder[feedCounter], cidOrder[submitCounter], requestCounter))) % deckSize;
      unchecked { requestCounter++; }
      //Testing --------------------------------------------------------------
      // uint256 random;
      // if(requestCounter < deckSize) {
      //   random = requestCounter;
      //   unchecked { requestCounter++; }
      // } else {
      //   requestCounter = 0;
      //   random = requestCounter;
      //   unchecked { requestCounter++; }
      // }
      //---------------------------------------------------------------------
      editing[msg.sender] = MiniFrankie(deck[random], block.timestamp, random);
      emit RequestedText(deck[random], msg.sender);
    }

    // Updates Frankenstein Text data through _updateFrankie().
    // If the Frankie has 5 contributions: finalizes Frankenstein Text.
    // Else: sets newCid in the end of cidOrder cue and if it's the first submited
    // ramification of oldCid: substitutes it (in the deck) with the first CID of cidOrder cue.
    function submitText(string calldata oldCid, string calldata newCid) public isValid(oldCid) {
      _updateFrankie(newCid, oldCid);
      if (frankies[newCid].writers.length == 5) {
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

    // Checks if the untitled Frankenstein Text is still valid and is owned by the caller.
    // Updates Frankenstein Text data through _updateFrankie().
    // Mints Frankenstein Text NFT and delete respective untitled from untitledTexts.
    function mintFrankie(string calldata oldCid, string calldata newCid, uint untitledId) public {
        require(frankies[oldCid].endedSince + 7 days > block.timestamp);
        require(keccak256(abi.encodePacked(oldCid)) == keccak256(abi.encodePacked(untitledTexts[msg.sender][untitledId])));
        _updateFrankie(newCid, oldCid);
        _safeMint(msg.sender, frankieId);
        delete untitledTexts[msg.sender][untitledId];
        mintedCids[frankieId] = newCid;
        emit MintedFrankie(frankieId, newCid, oldCid);
        frankieId++;
    }

    // Returns NFT CID corresponding to the id parameter.
    function mintedCidById(uint id) public view returns(string memory) {
      require(id < frankieId);
      return mintedCids[id];
    }

    // Returns newest untitled text id for the caller.
    function requestNewestUntitledId() public view returns(uint) {
        require(untitledTexts[msg.sender].length > 0);
        return untitledTexts[msg.sender].length - 1;
    }

    // Returns caller's untitled CID with the id of the untitledId parameter.
    function requestUntitledText(uint untitledId) public view returns(string memory) {
        return untitledTexts[msg.sender][untitledId];
    }

    // Returns seconds passed since 5th contribution of the untitledTexts[msg.sender][untitledId].
    function requestUntitledEndedSince(uint untitledId) public view returns(uint) {
        return (block.timestamp - frankies[untitledTexts[msg.sender][untitledId]].endedSince);
    }

    // Checks if the caller is victor.
    // Creates an new Frankie with the cid parameter.
    // If the deck is incomplete: feeds cid into deck.
    // Feeds cid in the cidOrder cue.
    function seedPlot(string calldata cid) public isVictor() {
        string[] memory cids;
        address[] memory writers;
        frankies[cid] = Frankie(cids, writers, 0);
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