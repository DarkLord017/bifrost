# VerifyProofAggregation Contract

This project contains a Solidity contract for verifying proof aggregations using the zkVerify system with RISC0 proving system.

## Contract Overview

The `verifyProofAggregation` contract provides functionality to verify aggregated proofs by:
- Computing a leaf hash from the provided proof data
- Verifying the proof against a Merkle tree using the zkVerify system
- Supporting RISC0 proving system with version v1.1

## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

First, copy the environment file and configure it:
```shell
$ cp .env.example .env
# Edit .env with your actual values
```

Deploy the VerifyProofAggregation contract:
```shell
$ forge script script/Deploy.s.sol:DeployScript --rpc-url $RPC_URL --broadcast --verify
```

Or deploy to a local network:
```shell
$ anvil # Start local node in another terminal
$ forge script script/Deploy.s.sol:DeployScript --rpc-url http://localhost:8545 --broadcast
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
