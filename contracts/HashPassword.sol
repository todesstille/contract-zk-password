/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./PoseidonT2.sol";

contract HashPassword {
    function hashPassword(string calldata password) external pure returns(uint256) {
        bytes memory passwordBytes = bytes(password);
        require(passwordBytes.length <= 32, "Length of password must be not more than 32 bytes");

        uint256 passwordUint = uint256(bytes32(passwordBytes)) >> (256 - passwordBytes.length * 8);

        uint256[1] memory singleton = [passwordUint];

        return PoseidonT2.hash(singleton);
    }

}