// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
// import "hardhat/console.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;
    address public marketPlaceAddress;
     
    constructor (address marketPlaceAddress_) ERC721("CRAZY MONKEY", "CM"){
        marketPlaceAddress = marketPlaceAddress_;
    }

    function mintNFT(string memory tokenURI) external  returns (uint){
        _tokenIds.increment(); 
        uint tokenId =  _tokenIds.current();
        _safeMint(msg.sender,tokenId);
        _setTokenURI(tokenId, tokenURI);
        setApprovalForAll(marketPlaceAddress, true);
        return tokenId;
    }

}