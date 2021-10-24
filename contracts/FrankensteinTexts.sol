pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract FrankensteinTexts is ERC721 {

    uint256 public requestCounter;

    uint256 public submitCounter;

    uint256 public frankieId;

    bool public firstTime;

    bool public green;

    address public victor;

    event RequestedText(string cid, bool isPlot);

    event MintedFrankie(uint nftId, string nftCid);

    struct Frankie {
        string[] cids;
        address[] writers;
        uint256 editSince;
        address editor;
    }

    mapping(string => Frankie) public frankies;

    mapping(uint256 => string) private cidOrder;

    mapping(address => string[]) public untitledTexts;

    mapping(address => uint) public untitledCounter;

    mapping(uint256 => string) public mintedCids;

    constructor() ERC721("Frankies", "FKE") {
        requestCounter = 0;
        submitCounter = 0;
        frankieId = 0;
        victor = msg.sender;
        firstTime = true;
        green = false;
    }

    modifier isVictor() {
        require(msg.sender == victor);
        _;
    }

    modifier isGreen() {
        require(green == true);
        _;
    }

    modifier isEditor(string calldata oldCid) {
        require(frankies[oldCid].editor == msg.sender);
        _;
    }

    modifier hasUntitled() {
        require(untitledTexts[msg.sender].length > untitledCounter[msg.sender]);
        _;
    }

    function _setGreenTrue() private {
        uint256 distance;
        unchecked { distance = submitCounter - requestCounter; }
        if (green == false && 100 < distance) {
            green = true;
        }
    }

    function _shuffle() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.difficulty,
                        block.timestamp,
                        cidOrder[requestCounter],
                        cidOrder[submitCounter]
                    )
                )
            ) % 100;
    }

    function _dealer() private {
        uint256 random = _shuffle();
        string memory chosen = cidOrder[random];
        cidOrder[random] = cidOrder[requestCounter];
        cidOrder[requestCounter] = chosen;
    }

    function _startFrankie() private returns (string memory) {
        string memory startCid = string(abi.encodePacked(cidOrder[requestCounter], '000'));
        string[] memory cids;
        address[] memory writers;
        frankies[startCid] = Frankie(cids, writers, block.timestamp, msg.sender);
        return startCid;
    }

    function _updateFrankie(string calldata newCid, string calldata oldCid) private {
        frankies[newCid] = frankies[oldCid];
        frankies[newCid].cids.push(newCid);
        frankies[newCid].writers.push(msg.sender);
        frankies[newCid].editor = address(0);
    }

    function requestText() public isGreen() returns (string memory) {
        _dealer();
        uint256 rc = requestCounter;
        if (rc % 4 == 0) {
            if (firstTime == true) {
                string memory startCid = _startFrankie();
                firstTime = false;
                emit RequestedText(startCid, true);
                return startCid;
            } else {
                firstTime = true;
            }
        }
        uint256 distance;
        unchecked {
            requestCounter++;
            distance = submitCounter - requestCounter;
        }
        if (100 >= distance) {
            green = false;
        }
        frankies[cidOrder[rc]].editSince = block.timestamp;
        frankies[cidOrder[rc]].editor = msg.sender;
        emit RequestedText(cidOrder[rc], false);
        return cidOrder[rc];
    }

    function submitText(string calldata oldCid, string calldata newCid) public isEditor(oldCid) {
        if (frankies[oldCid].editSince + 1 hours > block.timestamp) {
            _updateFrankie(newCid, oldCid);
            if (frankies[newCid].writers.length == 5) {
                for (uint256 i = 0; i < 5; i++) {
                    untitledTexts[frankies[newCid].writers[i]].push(newCid);
                }
            } else {
                cidOrder[submitCounter] = newCid;
                unchecked { submitCounter++; }
            }
        } else {
            cidOrder[submitCounter] = oldCid;
            unchecked { submitCounter++; }
        }
        _setGreenTrue();
    }

    function mintFrankie(
        string calldata oldCid,
        string calldata newCid
    ) public returns (uint256) {
        require(frankies[oldCid].editSince + 3 days > block.timestamp);
        bool isWriter;
        for(uint i=0; i < 5; i++) {
            if(msg.sender == frankies[oldCid].writers[i]) {
                isWriter = true;
            }
        }
        require(isWriter = true);

        _updateFrankie(newCid, oldCid);
        untitledCounter[msg.sender]++;
        frankieId++;
        _safeMint(msg.sender, frankieId);
        mintedCids[frankieId] = newCid;
        emit MintedFrankie(frankieId, newCid);
        return frankieId;
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
        frankies[cid] = Frankie(cids, writers, block.timestamp, msg.sender);
        frankies[cid].cids.push(cid);
        frankies[cid].writers.push(msg.sender);
        cidOrder[submitCounter] = cid;
        submitCounter++;
        _setGreenTrue();
    }
}
