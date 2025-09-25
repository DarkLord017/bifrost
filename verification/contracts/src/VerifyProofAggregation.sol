// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.20;

import {IVerifyProofAggregation} from "./interfaces/IVerifyProofAggregation.sol";

contract verifyProofAggregation {
    bytes32 public constant PROVING_SYSTEM_ID = keccak256(abi.encodePacked("risc0"));

    bytes32 public constant VERSION_HASH = sha256(abi.encodePacked("risc0:v1.1"));

    address public zkVerify;

    bytes32 public vkey;

    constructor(address _zkVerify, bytes32 _vkey) {
        zkVerify = _zkVerify;
        vkey = _vkey;
    }

    function checkHash(
        bytes memory _hash,
        uint256 _aggregationId,
        uint256 _domainId,
        bytes32[] calldata _merklePath,
        uint256 _leafCount,
        uint256 _index
    ) public view {

        bytes32 leaf = keccak256(abi.encodePacked(PROVING_SYSTEM_ID, vkey, VERSION_HASH, keccak256(abi.encodePacked(_hash))));

        require(IVerifyProofAggregation(zkVerify).verifyProofAggregation(
            _domainId,
            _aggregationId,
            leaf,
            _merklePath,
            _leafCount,
            _index
        ), "Invalid proof");
    }
}