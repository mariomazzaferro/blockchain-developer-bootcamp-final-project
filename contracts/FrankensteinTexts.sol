pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract FrankensteinTexts is ERC721 {

    uint public requestCounter;

    uint public submitCounter;

    uint public frankieId;

    bool private firstTime;

    bool public green;

    address public victor;

    struct Frankie {
      bytes32[] hashes;
      address[] writers;
      uint editSince;
    }

    mapping (bytes32 => Frankie) frankies;

    mapping (uint => bytes32) hashOrder;

    mapping (address => bytes32[]) untitledTexts;

    mapping (uint => bytes32) mintedHashes;

    constructor() ERC721("Frankies", "FKE") {
      requestCounter = 0;
      submitCounter = 0;
      frankieId = 0;
      victor = msg.sender;
      firstTime = true;
      green = true;
    }

    modifier isVictor() {
      require(msg.sender == victor);
      _;
    }

    modifier isGreen() {
      require(green == true);
      _;
    }

    function _shuffle() private view returns(uint) {
      return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, hashOrder[requestCounter], hashOrder[submitCounter]))) % 100;
    }

    function _dealer() private {
      uint random = _shuffle();
      bytes32 chosen = hashOrder[random];
      hashOrder[random] = hashOrder[requestCounter];
      hashOrder[requestCounter] = chosen;
    }

    function _startFrankie() private returns(bytes32) {
      bytes32 startHash = bytes32(keccak256(abi.encodePacked(block.difficulty, block.timestamp, hashOrder[requestCounter], hashOrder[submitCounter])));
      bytes32[] memory hashes;
      address[] memory writers;
      frankies[startHash] = Frankie(hashes, writers, block.timestamp);
      return startHash;
    }

    function _updateFrankie(bytes32 newHash, bytes32 oldHash) private {
      frankies[newHash] = frankies[oldHash];
      frankies[newHash].hashes.push(newHash);
      frankies[newHash].writers.push(msg.sender);
    }

    function requestText() public isGreen() returns(bytes32) {
      uint distance;
      unchecked { distance = submitCounter - requestCounter; }
      if(distance >= 100) {
        green = false;
      }
      _dealer();
      uint rc = requestCounter;
      if(rc % 5 == 0) {
        if(firstTime == true) {
          bytes32 startHash = _startFrankie();
          firstTime = false;
          return startHash;
        } else {
          firstTime = true;
        }
      }
      unchecked { requestCounter++; }
      frankies[hashOrder[rc]].editSince = block.timestamp;
      return hashOrder[rc];
    }

    function submitText(bytes32 newHash, bytes32 oldHash) public {
      if(frankies[oldHash].editSince + 1 hours < block.timestamp) {
        _updateFrankie(newHash, oldHash);
        if(frankies[newHash].writers.length == 5) {
          for(uint i=0; i < 5; i++) {
            untitledTexts[frankies[newHash].writers[i]].push(newHash);
          }
        } else {
          hashOrder[submitCounter] = newHash;
          unchecked { submitCounter++; } 
        }
      } else {
        hashOrder[submitCounter] = oldHash;
        unchecked { submitCounter++; }
      }
      uint distance;
      unchecked { distance = submitCounter - requestCounter; }
      if(green == false && 100 <= distance) {
        green = true;
      }
    }

    function mintFrankie(bytes32 newHash, bytes32 oldHash, uint untitledId) public returns(uint) {
      _updateFrankie(newHash, oldHash);
      delete untitledTexts[msg.sender][untitledId];
      frankieId++;
      _safeMint(msg.sender, frankieId);
      mintedHashes[frankieId] = newHash;
      return frankieId;
    }

    function seedPlot(bytes32 plotHash) public isVictor() {
      bytes32[] memory hashes;
      address[] memory writers;
      frankies[plotHash] = Frankie(hashes, writers, block.timestamp);
      frankies[plotHash].hashes.push(plotHash);
      frankies[plotHash].writers.push(msg.sender);
      hashOrder[requestCounter] = plotHash;
      requestCounter++;
    }
}