require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    mumbai: {
      chainId: 80001,
      url: process.env.POLYGON_MUMBAI_RPC_URL,
      accounts: [process.env.WALLET_PRIVATE_KEY]
    },
    sepolia: {
      chainId: 84532,
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.WALLET_PRIVATE_KEY]
    }
  }
};
