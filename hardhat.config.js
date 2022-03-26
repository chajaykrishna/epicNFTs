require("@nomiclabs/hardhat-waffle");
require ('dotenv').config();
require("@nomiclabs/hardhat-etherscan");

const {PrivateKey, RinkebyURL, EtherscanApiKey} = process.env;


module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "hardhat",
  networks: {
    rinkeby: {
      url: RinkebyURL,
      accounts: [PrivateKey]
    }},
    etherscan: {
      apiKey: EtherscanApiKey
    },
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  },
};
