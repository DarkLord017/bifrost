// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

import {IVerifyProofAggregation} from "../../src/interfaces/IVerifyProofAggregation.sol";

contract MockZkVerify is IVerifyProofAggregation {
    mapping(bytes32 => bool) public validProofs;
    bool public defaultReturnValue = true;

    function setProofValidity(bytes32 proofHash, bool isValid) external {
        validProofs[proofHash] = isValid;
    }

    function setDefaultReturnValue(bool _defaultValue) external {
        defaultReturnValue = _defaultValue;
    }

    function verifyProofAggregation(
        uint256 _domainId,
        uint256 _aggregationId,
        bytes32 _leaf,
        bytes32[] calldata _merklePath,
        uint256 _leafCount,
        uint256 _index
    ) external view override returns (bool) {
        // Create a unique hash for this specific proof
        bytes32 proofHash = keccak256(abi.encodePacked(
            _domainId,
            _aggregationId,
            _leaf,
            _merklePath,
            _leafCount,
            _index
        ));

        // If a specific validity is set for this proof, return it
        if (validProofs[proofHash]) {
            return true;
        }

        // Otherwise return the default value
        return defaultReturnValue;
    }
}
