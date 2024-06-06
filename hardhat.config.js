require("@nomicfoundation/hardhat-toolbox");
// require("@solarity/hardhat-migrate");
// require("@nomiclabs/hardhat-waffle");
require("hardhat-circom");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
    },
  },
  migrate: {
    pathToMigrations: "./deploy/",
  },
  circom: {
    inputBasePath: "./circuits",
    ptau: "https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_15.ptau",
    circuits: [
      {
        name: "password",
      },
    ],
  },
};
