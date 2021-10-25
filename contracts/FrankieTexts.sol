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

    event MintedFrankie(uint nftId, string nftCid); // vai ter q ter a 5th cid tbm e indexed

    event NewDeckSize(uint newDeckSize);

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

    mapping(address => uint) public untitledCounter;

    mapping(uint256 => string) public mintedCids;

    mapping(string => bool) private plotEnded;

    constructor() ERC721("Frankies", "FKE") {
        requestCounter = 0;
        feedCounter = 0;
        submitCounter = 0;
        deckCounter = 0;
        deckSize = 100;
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

    modifier hasUntitled() {
        require(untitledTexts[msg.sender].length > untitledCounter[msg.sender]);
        _;
    }

    function _startFrankie() private returns (string memory) { // talvez nem precise dessa função
        string memory startCid = string(abi.encodePacked('0')); // frontend checka se o cid é 0
        string[] memory cids;
        address[] memory writers;
        frankies[startCid] = Frankie(cids, writers, block.timestamp);
        return startCid;
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
      //-----------------------------------------------------------
      uint256 random = uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, cidOrder[feedCounter], cidOrder[submitCounter], requestCounter))) % 100;
      //-----------------------------------------------------------
      // uint256 random;
      // if(requestCounter < 100) {
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

    function mintFrankie(string calldata oldCid,string calldata newCid) public {
        require(frankies[oldCid].endedSince + 3 days > block.timestamp);
        require(keccak256(abi.encodePacked(oldCid)) == keccak256(abi.encodePacked(untitledTexts[msg.sender][untitledCounter[msg.sender]])));
        _updateFrankie(newCid, oldCid);
        untitledCounter[msg.sender]++;
        _safeMint(msg.sender, frankieId);
        mintedCids[frankieId] = newCid;
        emit MintedFrankie(frankieId, newCid);
        frankieId++;
    }

    function requestUntitled() public view hasUntitled() returns(string memory) {
        return untitledTexts[msg.sender][untitledCounter[msg.sender]];
    }

    function discardUntitled() public hasUntitled() {
        untitledCounter[msg.sender]++;
    }

    function seedPlot(string calldata cid) public isVictor() {
        string[] memory cids;
        address[] memory writers;
        frankies[cid] = Frankie(cids, writers, 0);
        frankies[cid].cids.push(cid);
        frankies[cid].writers.push(msg.sender);
        if(deckCounter < deckSize) {
          deck[submitCounter] = cid;
          unchecked { feedCounter++; }
          deckCounter++;
        }
        cidOrder[submitCounter] = cid;
        unchecked { submitCounter++; }
    }

    function mintedCidById(uint id) public view returns(string memory) {
      require(id < frankieId);
      return mintedCids[id];
    }

    function setDeckSize(uint newSize) public isVictor() {
      deckSize = newSize;
      emit NewDeckSize(deckSize);
    }
}