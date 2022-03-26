const { ethers, artifacts } = require("hardhat");

async function main() {

  const [deployer] = await ethers.getSigners();


  // deploy contracts here:
  const Marketplace = await ethers.getContractFactory("NftMarketPlace");
  const marketplace = await Marketplace.deploy();

  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(marketplace.address);
  console.log(`nft contract address: ${nft.address}, marketplace address: ${marketplace.address}`);

  await marketplace.setNFTContractAddress(nft.address);
  
  
  // For each contract, pass the deployed contract and name to this function to save a copy of the contract ABI and address to the front end.
  saveFrontendFiles(nft, "NFT");
  saveFrontendFiles(marketplace, "NftMarketPlace");

}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../frontend/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
