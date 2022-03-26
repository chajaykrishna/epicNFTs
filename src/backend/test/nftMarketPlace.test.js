const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NftmarketPlace", function () {
  let deployer, add1, add2 = ethers.getSigner(); 
  let nft, marketplace;
  let URI = "Hello";
  beforeEach(async () => {
    const NFT = await ethers.getContractFactory("NFT");
   nft = await NFT.deploy(); 

  const MarketPlace = await ethers.getContractFactory("NftMarketPlace");
  marketplace = await MarketPlace.deploy();

  await  marketplace.deployed();
  [deployer,add1,add2] = await ethers.getSigners();
  });
  
describe("Deployment", ()=>{
  it("should tract the name and symbol of the NFT collection", async () => {
    expect(await nft.name()).to.equal("CRAZY MONKEY");
  });

  it("check the account balace", async ()=> {
    await nft.connect(add1).mintNFT(URI);
    expect(await nft.ownerOf(1)).to.equal(add1.address);
  })
})
});
