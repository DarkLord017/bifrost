// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {verifyProofAggregation} from "../src/VerifyProofAggregation.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address zkVerifyAddress = vm.envAddress("ZK_VERIFY_ADDRESS");
        bytes32 vkey = vm.envBytes32("VKEY");

        vm.startBroadcast(deployerPrivateKey);

        verifyProofAggregation verifyContract = new verifyProofAggregation(
            zkVerifyAddress,
            vkey
        );

        console.log("VerifyProofAggregation deployed to:", address(verifyContract));
        console.log("ZkVerify address:", zkVerifyAddress);
        console.log("VKey:", vm.toString(vkey));

        vm.stopBroadcast();
    }
}
