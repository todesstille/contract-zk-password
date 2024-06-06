// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./PasswordVerifier.sol";

contract Password is Verifier {
    uint256 constant PASSWORD_POSEIDON_HASH = 8292412115872593720727672728091676037275591310896020035034530974778542193570;

    event PasswordCorrect(bool);

    function protected(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c
    ) external {
        uint[2] memory input;
        
        input[0] = PASSWORD_POSEIDON_HASH;
        input[1] = uint256(uint160(msg.sender));
        
        bool result = verifyProof(a, b, c, input); 
        
        emit PasswordCorrect(result);
    }
}