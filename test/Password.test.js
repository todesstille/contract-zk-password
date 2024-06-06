const hre = require("hardhat");
const { ethers } = require("hardhat");
const { assert, expect } = require("chai");
const snarkjs = require("snarkjs");

const {poseidon} = require("poseidon-encryption");

const validPassword = ethers.BigNumber.from("0x" + Buffer.from("Valid Password", 'utf-8').toString('hex')).toString();
const invalidPassword = ethers.BigNumber.from("0x" + Buffer.from("Invalid Password", 'utf-8').toString('hex')).toString();

let correctInput = {
  password: validPassword,
  passwordHash: poseidon([validPassword]).toString(),
  proverAddress: "0",
  senderAddress: "0"
};
let incorrectInput = {
  password: invalidPassword,
  passwordHash: poseidon([validPassword]).toString(),
  proverAddress: "0",
  senderAddress: "0"
};
const sanityCheck = true;

describe("Password", async () => {

  before(async () => {
    circuit = await hre.circuitTest.setup("password");
    
    [admin, alice] = await ethers.getSigners();
  });

  describe('circuit tests', () => {
    it("produces a valid password witness", async () => {
      const witness = await circuit.calculateWitness(correctInput, sanityCheck);
      await circuit.checkConstraints(witness);
    });
  
    it("has expected witness values", async () => {
      const witness = await circuit.calculateLabeledWitness(
        correctInput,
        sanityCheck
      );
      assert.propertyVal(witness, "main.password", correctInput.password);
      assert.propertyVal(witness, "main.passwordHash", correctInput.passwordHash);
      assert.propertyVal(witness, "main.senderAddress", correctInput.senderAddress);
    });
  
    it("fails if the input is wrong", async () => {
      await expect(circuit.calculateWitness(incorrectInput, sanityCheck)).to.be.rejectedWith(Error);
    });
  })

  describe('Contract', async () => {
    beforeEach(async () => {
      const Password = await ethers.getContractFactory("Password");
      contract = await Password.deploy();
    });
    it('Verifies for correct inputs', async () => {
      // const myAddress = ethers.BigNumber.from(admin.address).toString();
      // correctInput.proverAddress = myAddress;
      // correctInput.senderAddress = myAddress;
      
      const {proof, publicSignals} = 
        await snarkjs.groth16.fullProve(correctInput, "circuits/password.wasm", "circuits/password.zkey");

      const rawcalldata = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);
      jsonCalldata = JSON.parse("["+rawcalldata+"]");

      expect(await contract.verifyProof(
          jsonCalldata[0], 
          jsonCalldata[1], 
          jsonCalldata[2],
          jsonCalldata[3]
        )).to.equal(true);
      // await expect(contract.protected(input))
      //   .to.emit(contract, "PasswordCorrect")
      //   .withArgs(true);
    });

    it('Verifies for another correct inputs', async () => {
      const myAddress = ethers.BigNumber.from(admin.address).toString();
      correctInput.proverAddress = myAddress;
      correctInput.senderAddress = myAddress;
      
      const {proof, publicSignals} = 
        await snarkjs.groth16.fullProve(correctInput, "circuits/password.wasm", "circuits/password.zkey");

      const rawcalldata = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);
      jsonCalldata = JSON.parse("["+rawcalldata+"]");

      expect(await contract.verifyProof(
          jsonCalldata[0], 
          jsonCalldata[1], 
          jsonCalldata[2],
          jsonCalldata[3]
        )).to.equal(true);
    });

    it('Emits true for correct proofs', async () => {
      const myAddress = ethers.BigNumber.from(admin.address).toString();
      correctInput.proverAddress = myAddress;
      correctInput.senderAddress = myAddress;
      
      const {proof, publicSignals} = 
        await snarkjs.groth16.fullProve(correctInput, "circuits/password.wasm", "circuits/password.zkey");

      const rawcalldata = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);
      jsonCalldata = JSON.parse("["+rawcalldata+"]");

      await expect(contract.protected(
        jsonCalldata[0], 
        jsonCalldata[1], 
        jsonCalldata[2]
      )).to.emit(contract, "PasswordCorrect")
        .withArgs(true);
    });

    it('Emits false for incorrect address', async () => {
      const myAddress = ethers.BigNumber.from(admin.address).toString();
      correctInput.proverAddress = myAddress;
      correctInput.senderAddress = myAddress;
      
      const {proof, publicSignals} = 
        await snarkjs.groth16.fullProve(correctInput, "circuits/password.wasm", "circuits/password.zkey");

      const rawcalldata = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);
      jsonCalldata = JSON.parse("["+rawcalldata+"]");

      await expect(contract.connect(alice).protected(
        jsonCalldata[0], 
        jsonCalldata[1], 
        jsonCalldata[2]
      )).to.emit(contract, "PasswordCorrect")
        .withArgs(false);
    });

    it('Emits false for invalid password', async () => {
      const myAddress = ethers.BigNumber.from(admin.address).toString();
      incorrectInput.proverAddress = myAddress;
      incorrectInput.senderAddress = myAddress;
      incorrectInput.passwordHash = poseidon([invalidPassword]).toString();
      
      const {proof, publicSignals} = 
        await snarkjs.groth16.fullProve(incorrectInput, "circuits/password.wasm", "circuits/password.zkey");

      const rawcalldata = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);
      jsonCalldata = JSON.parse("["+rawcalldata+"]");

      await expect(contract.protected(
        jsonCalldata[0], 
        jsonCalldata[1], 
        jsonCalldata[2]
      )).to.emit(contract, "PasswordCorrect")
        .withArgs(false);
    });
  })
});