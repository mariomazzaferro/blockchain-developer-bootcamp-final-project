pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Frankies is ERC721 {

    uint private requestCounter;

    uint private submitCounter;

    bool private firstTime;

    address private victor;

    struct Frankie {
      bytes32[] hashes;
      address[] writers;
      uint editSince;
    }

    mapping (bytes32 => Frankie) frankies;

    mapping (uint => bytes32) hashOrder;

    mapping (address => bytes32[]) untitledTexts;

    constructor() ERC721("Frankies", "FKE") {
      requestCounter = 0;
      submitCounter = 0;
      victor = msg.sender;
      firstTime = true;
    }

    function requestText() public returns(bytes32) {
      uint rc = requestCounter;
      if(rc % 5 == 0) {
        if(firstTime == true) {
          firstTime = false;
          return bytes32(0);
        } else {
          firstTime = true;
        }
      }
      for(uint i=0; i < frankies[hashOrder[rc]].writers.length; i++) {
        require(msg.sender != frankies[hashOrder[rc]].writers[i]);
      }
      requestCounter++;
      frankies[hashOrder[rc]].editSince = block.timestamp;
      return hashOrder[rc];
    }

    function submitText(bytes32 newHash, bytes32 oldHash) public {
      if(frankies[oldHash].editSince + 1 hours < block.timestamp) {
        frankies[newHash] = frankies[oldHash];
        frankies[newHash].hashes.push(newHash);
        frankies[newHash].writers.push(msg.sender);
        if(frankies[newHash].writers.length == 5) {
          for(uint i=0; i < 5; i++) {
            untitledTexts[frankies[newHash].writers[i]].push(newHash);
          }
        } else {
          hashOrder[submitCounter] = newHash;
          submitCounter++;
        }
      } else {
        hashOrder[submitCounter] = oldHash;
        submitCounter++;
      }
    }
}