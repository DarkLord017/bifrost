// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {verifyProofAggregation} from "../src/VerifyProofAggregation.sol";
import {MockZkVerify} from "./mocks/MockZkVerify.sol";

contract VerifyProofAggregationTest is Test {
    verifyProofAggregation public verifyContract;
    MockZkVerify public mockZkVerify;
    
    address public zkVerifyAddress;
    bytes32 public vkey;
    
    // Test data
    bytes public testHash = hex"1234567890abcdef";
    uint256 public aggregationId = 12345;
    uint256 public domainId = 1;
    bytes32[] public merklePath;
    uint256 public leafCount = 8;
    uint256 public index = 3;

    function setUp() public {
        // Deploy mock zkVerify contract
        mockZkVerify = new MockZkVerify();
        zkVerifyAddress = address(mockZkVerify);
        
        // Set test vkey
        vkey = keccak256("test_verification_key");
        
        // Deploy the contract under test
        verifyContract = new verifyProofAggregation(zkVerifyAddress, vkey);
        
        // Setup test merkle path
        merklePath.push(keccak256("merkle_node_1"));
        merklePath.push(keccak256("merkle_node_2"));
        merklePath.push(keccak256("merkle_node_3"));
    }

    function testConstructor() public {
        assertEq(verifyContract.zkVerify(), zkVerifyAddress);
        assertEq(verifyContract.vkey(), vkey);
        assertEq(verifyContract.PROVING_SYSTEM_ID(), keccak256(abi.encodePacked("risc0")));
        assertEq(verifyContract.VERSION_HASH(), sha256(abi.encodePacked("risc0:v1.1")));
    }

    function testCheckHashSuccess() public {
        // Set mock to return true for valid proofs
        mockZkVerify.setDefaultReturnValue(true);
        
        // This should not revert
        verifyContract.checkHash(
            testHash,
            aggregationId,
            domainId,
            merklePath,
            leafCount,
            index
        );
    }

    function testCheckHashFailure() public {
        // Set mock to return false for invalid proofs
        mockZkVerify.setDefaultReturnValue(false);
        
        // This should revert with "Invalid proof"
        vm.expectRevert("Invalid proof");
        verifyContract.checkHash(
            testHash,
            aggregationId,
            domainId,
            merklePath,
            leafCount,
            index
        );
    }

    function testCheckHashWithSpecificProofValidity() public {
        // Calculate the leaf that will be generated
        bytes32 leaf = keccak256(abi.encodePacked(
            verifyContract.PROVING_SYSTEM_ID(),
            vkey,
            verifyContract.VERSION_HASH(),
            keccak256(abi.encodePacked(testHash))
        ));
        
        // Create proof hash for the mock
        bytes32 proofHash = keccak256(abi.encodePacked(
            domainId,
            aggregationId,
            leaf,
            merklePath,
            leafCount,
            index
        ));
        
        // Set this specific proof as valid
        mockZkVerify.setProofValidity(proofHash, true);
        mockZkVerify.setDefaultReturnValue(false);
        
        // This should succeed because we set this specific proof as valid
        verifyContract.checkHash(
            testHash,
            aggregationId,
            domainId,
            merklePath,
            leafCount,
            index
        );
    }

    function testLeafGeneration() public view {
        bytes32 expectedLeaf = keccak256(abi.encodePacked(
            verifyContract.PROVING_SYSTEM_ID(),
            vkey,
            verifyContract.VERSION_HASH(),
            keccak256(abi.encodePacked(testHash))
        ));
        
        // We can't directly test the internal leaf generation, but we can verify
        // the constants are correct
        assertEq(verifyContract.PROVING_SYSTEM_ID(), keccak256(abi.encodePacked("risc0")));
        assertEq(verifyContract.VERSION_HASH(), sha256(abi.encodePacked("risc0:v1.1")));
    }

    function testCheckHashWithDifferentParameters() public {
        mockZkVerify.setDefaultReturnValue(true);
        
        // Test with different aggregation ID
        verifyContract.checkHash(
            testHash,
            99999,
            domainId,
            merklePath,
            leafCount,
            index
        );
        
        // Test with different domain ID
        verifyContract.checkHash(
            testHash,
            aggregationId,
            999,
            merklePath,
            leafCount,
            index
        );
        
        // Test with different hash
        bytes memory differentHash = hex"abcdef1234567890";
        verifyContract.checkHash(
            differentHash,
            aggregationId,
            domainId,
            merklePath,
            leafCount,
            index
        );
    }

    function testCheckHashWithEmptyMerklePath() public {
        mockZkVerify.setDefaultReturnValue(true);
        
        bytes32[] memory emptyPath = new bytes32[](0);
        
        verifyContract.checkHash(
            testHash,
            aggregationId,
            domainId,
            emptyPath,
            leafCount,
            index
        );
    }

    function testCheckHashWithLargeMerklePath() public {
        mockZkVerify.setDefaultReturnValue(true);
        
        bytes32[] memory largePath = new bytes32[](10);
        for (uint i = 0; i < 10; i++) {
            largePath[i] = keccak256(abi.encodePacked("node", i));
        }
        
        verifyContract.checkHash(
            testHash,
            aggregationId,
            domainId,
            largePath,
            leafCount,
            index
        );
    }

    function testFuzzCheckHash(
        bytes memory _hash,
        uint256 _aggregationId,
        uint256 _domainId,
        uint256 _leafCount,
        uint256 _index
    ) public {
        // Bound the inputs to reasonable ranges
        vm.assume(_hash.length > 0 && _hash.length <= 1000);
        _aggregationId = bound(_aggregationId, 1, type(uint128).max);
        _domainId = bound(_domainId, 1, type(uint128).max);
        _leafCount = bound(_leafCount, 1, type(uint128).max);
        _index = bound(_index, 0, _leafCount - 1);
        
        mockZkVerify.setDefaultReturnValue(true);
        
        verifyContract.checkHash(
            _hash,
            _aggregationId,
            _domainId,
            merklePath,
            _leafCount,
            _index
        );
    }

    function testRevertOnInvalidProofFuzz(
        bytes memory _hash,
        uint256 _aggregationId,
        uint256 _domainId,
        uint256 _leafCount,
        uint256 _index
    ) public {
        // Bound the inputs to reasonable ranges
        vm.assume(_hash.length > 0 && _hash.length <= 1000);
        _aggregationId = bound(_aggregationId, 1, type(uint128).max);
        _domainId = bound(_domainId, 1, type(uint128).max);
        _leafCount = bound(_leafCount, 1, type(uint128).max);
        _index = bound(_index, 0, _leafCount - 1);
        
        mockZkVerify.setDefaultReturnValue(false);
        
        vm.expectRevert("Invalid proof");
        verifyContract.checkHash(
            _hash,
            _aggregationId,
            _domainId,
            merklePath,
            _leafCount,
            _index
        );
    }
}
