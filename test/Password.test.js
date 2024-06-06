const hre = require("hardhat");
const { ethers } = require("hardhat");
const { assert, expect } = require("chai");
const snarkjs = require("snarkjs");

describe("Password", async () => {

  before(async () => {
    const HashPassword = await ethers.getContractFactory("HashPassword");
    hashPassword = await HashPassword.deploy();
  });

  describe('Poseidon', async () => {
    it('Poseidon hash', async () => {
      hashedPassword = await hashPassword.hashPassword("2");
      console.log(hashedPassword);
    });
  })
});