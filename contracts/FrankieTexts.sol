pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract FrankieTexts is ERC721 {

    uint256 private requestCounter;

    uint256 public feedCounter;

    uint256 public submitCounter;

    uint256 public deckCounter;

    uint256 public deckSize;

    uint256 public frankieId;

    address public victor;

    event RequestedText(string chosenCid);

    event MintedFrankie(uint indexed nftId, string nftCid, string indexed fifthCid);

    struct Frankie {
      string[] cids;
      address[] writers;
      uint256 endedSince;
    }

    struct MiniFrankie {
      string cid;
      uint256 editSince;
      uint256 deckNumber;
    }

    mapping(string => Frankie) public frankies;

    mapping(uint256 => string) private cidOrder;

    mapping(address => MiniFrankie) private editing;

    mapping(uint256 => string) private deck;

    mapping(address => string[]) public untitledTexts;

    mapping(uint256 => string) public mintedCids;

    mapping(string => bool) private plotEnded;

    constructor() ERC721("Frankies", "FKE") {
        requestCounter = 0;
        feedCounter = 0;
        submitCounter = 0;
        deckCounter = 0;
        deckSize = 10;  //Production:100 / Testing:10
        frankieId = 0;
        victor = msg.sender;
    }

    modifier isVictor() {
        require(msg.sender == victor);
        _;
    }

    modifier isValid(string calldata oldCid) {
        require(keccak256(abi.encodePacked(editing[msg.sender].cid)) == keccak256(abi.encodePacked(oldCid)));
        require(editing[msg.sender].editSince + 2 hours > block.timestamp);
        _;
    }

    function _updateFrankie(string calldata newCid, string calldata oldCid) private {
        frankies[newCid] = frankies[oldCid];
        frankies[newCid].cids.push(newCid);
        frankies[newCid].writers.push(msg.sender);
    }

    function _endFrankie(string calldata newCid) private {
      frankies[newCid].endedSince = block.timestamp;
      for (uint256 i = 0; i < 5; i++) {
        untitledTexts[frankies[newCid].writers[i]].push(newCid);
      }
      if(!plotEnded[frankies[newCid].cids[0]]) {
        // alimenta um cid00000 no deck
        string memory startCid = string(abi.encodePacked(newCid, '00000'));
        string[] memory cids;
        address[] memory writers;
        frankies[startCid] = Frankie(cids, writers, 0);
        deck[editing[msg.sender].deckNumber] = startCid;
        plotEnded[frankies[newCid].cids[0]] = true;
      } else {
        // alimenta o cidOrder[feedCounter] no deck e aumenta feedCounter
        deck[editing[msg.sender].deckNumber] = cidOrder[feedCounter];
        unchecked { feedCounter++; } 
        }
    }

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
      //----------------------------------------------------------
      editing[msg.sender] = MiniFrankie(deck[random], block.timestamp, random);
      emit RequestedText(deck[random]);
    }

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

    function mintedCidById(uint id) public view returns(string memory) {
      require(id < frankieId);
      return mintedCids[id];
    }

    function requestNewestUntitledId() public view returns(uint) {
        require(untitledTexts[msg.sender].length > 0);
        return untitledTexts[msg.sender].length - 1;
    }

    function requestUntitledText(uint untitledId) public view returns(string memory) {
        return untitledTexts[msg.sender][untitledId];
    }

    function requestUntitledEndedSince(uint untitledId) public view returns(uint) {
        return (block.timestamp - frankies[untitledTexts[msg.sender][untitledId]].endedSince);
    }

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