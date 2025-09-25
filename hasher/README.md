# RISC Zero Rust Starter Template

Welcome to the RISC Zero Rust Starter Template! This template is intended to
give you a starting point for building a project using the RISC Zero zkVM.
Throughout the template (including in this README), you'll find comments
labelled `TODO` in places where you'll need to make changes. To better
understand the concepts behind this template, check out the [zkVM
Overview][zkvm-overview].

## Quick Start

First, make sure [rustup] is installed. The
[`rust-toolchain.toml`][rust-toolchain] file will be used by `cargo` to
automatically install the correct version.

To build all methods and execute the method within the zkVM, run the following
command:

```bash
cargo run
```

This is an empty template, and so there is no expected output (until you modify
the code).

# VNNS: Vector Neural Network Search with Zero-Knowledge Proofs

A complete **Vector Similarity Search** system that combines **embeddings**, **nearest neighbor search**, and **zero-knowledge proofs** using RISC Zero's zkVM. This project demonstrates how to build verifiable AI/ML pipelines where similarity search results can be cryptographically proven.

## 🎯 What is VNNS?

VNNS (Vector Neural Network Search) is a **verifiable vector similarity search** system that:

- **Embeds** text data into high-dimensional vectors using neural networks
- **Searches** for the most similar vectors using Euclidean distance
- **Proves** the correctness of search results using zero-knowledge proofs
- **Batches** large datasets efficiently using iterative similarity search

## 🏗️ Architecture

```
Data → Embeddings → Similarity Search → ZK Proofs
```

### Components

1. **`vnns-lib`** - Core similarity search algorithms
2. **`embedder`** - Text-to-embedding conversion using Ollama
3. **`host`** - Orchestrates ZK proving and verification
4. **`methods/guest`** - ZK circuit that performs provable similarity search

## 🚀 Quick Start

### Prerequisites

- [Rust](https://rustup.rs/) with RISC Zero toolchain
- [Ollama](https://ollama.ai/) for embeddings (optional - can use mock data)

### 1. Install RISC Zero Toolchain

```bash
# Install Rust toolchain
rzup install rust r0.1.81.0

# Install C++ toolchain
rzup install cpp 2024.01.05

# Install RISC Zero utilities
rzup extension install cargo-risczero v2.2.0
```

### 2. Build the Project

```bash
cargo build --release
```

### 3. Prepare Data

Create sample data in `data/movies.json`:

```json
[
  {
    "name": "Star Wars",
    "description": "A space adventure with galactic battles and heroic journeys"
  },
  {
    "name": "The Godfather",
    "description": "Mafia family power struggles and organized crime in New York"
  }
]
```

### 4. Generate Embeddings

```bash
# Index your data (requires Ollama running)
cargo run --bin vnns-embedder -- index -p data/movies.json

# Or use mock data for testing
# Creates: movies.samples.json (embeddings) and movies.index.json (full data)
```

### 5. Create Query

```bash
# Generate embedding for search query (requires Ollama)
cargo run --bin vnns-embedder -- query -p data/movies.json -t "space adventure with heroes"

# Or create query.json manually for testing
```

### 6. Run Similarity Search

```bash
# Execute in development mode (fast, no proofs)
RISC0_DEV_MODE=1 cargo run --release -- --execute

# Generate ZK proofs
cargo run --release -- --prove
```

## 📖 Detailed Workflow

### Phase 1: Data Preparation

#### 1.1 Define Your Dataset

Create a JSON file with your data:

```json
[
  {
    "name": "Item Name",
    "description": "Detailed description for embedding"
  }
]
```

#### 1.2 Generate Embeddings

The `embedder` tool converts text to vectors:

```bash
cargo run --bin vnns-embedder -- index -p data/movies.json
```

**What it does:**
- Reads `data/movies.json`
- Converts each item to text format: `"Star Wars: A space adventure..."`
- Calls Ollama API to generate embeddings
- Saves full data to `movies.index.json`
- Saves just embeddings to `movies.samples.json` (for ZK host)

#### 1.3 Create Search Query

```bash
cargo run --bin vnns-embedder -- query -p data/movies.json -t "your search text"
```

**What it does:**
- Converts query text to embedding vector
- Saves to `movies.query.json`

### Phase 2: Similarity Search

#### 2.1 Load Data

The host loads embeddings and query:

```rust
// Load samples (Vec<Vec<f32>>)
let samples: Vec<Vec<f32>> = serde_json::from_str(&fs::read_to_string("samples.json")?)?;

// Load query (Vec<f32>)
let query: Vec<f32> = serde_json::from_str(&fs::read_to_string("query.json")?)?;
```

#### 2.2 Find Best Match

Uses Euclidean distance to find closest vector:

```rust
let best_idx = vnns_lib::compute_best_sample(&samples, &query);
println!("Best match index: {}", best_idx);
```

#### 2.3 Batched Search (Large Datasets)

For large datasets, uses iterative batched search:

```rust
// Process in chunks of batch_size
let (final_idx, result_vector) = iterative_similarity_search(samples, query, batch_size);
```

### Phase 3: Zero-Knowledge Proofs

#### 3.1 Development Mode

Fast execution without proofs:

```bash
RISC0_DEV_MODE=1 cargo run --release -- --execute
```

#### 3.2 Production Proofs

Generate verifiable proofs:

```bash
cargo run --release -- --prove
```

**What happens:**
- Guest code runs in zkVM with samples + query
- Computes similarity search provably
- Commits results to journal with SHA256 hashes
- Host verifies the proof cryptographically

#### 3.3 Proof Verification

Anyone can verify proofs without re-running computation:

```rust
receipt.verify(HASHER_GUEST_ID)?;
println!("✅ Proof verified!");
```

## 🔧 Technical Details

### Similarity Algorithm

Uses **Euclidean distance** for similarity:

```rust
pub fn compute_best_sample(samples: &[Vec<f32>], query: &[f32]) -> usize {
    samples
        .iter()
        .map(|sample| {
            sample.iter()
                .zip(query)
                .map(|(a, b)| (a - b).powi(2))
                .sum::<f32>()
                .sqrt()
        })
        .enumerate()
        .min_by(|a, b| a.1.partial_cmp(&b.1).unwrap())
        .unwrap()
        .0
}
```

### ZK Commitments

Guest commits to computation integrity:

```rust
// Hash inputs and outputs
let query_commit = Sha256::digest(query_bytes);
let samples_commit = Sha256::digest(samples_bytes);
let output_commit = Sha256::digest(output_bytes);

// Commit to journal (public)
env::commit(&idx);
env::commit(&query_commit);
env::commit(&samples_commit);
env::commit(&output_commit);
```

### I/O in zkVM

- **Host → Guest**: `env::write()` for private data
- **Guest → Host**: `env::write()` for private results
- **Guest → Journal**: `env::commit()` for public proofs

## 🎮 Example Usage

### Complete Pipeline

```bash
# 1. Prepare data
echo '[{"name": "Star Wars", "description": "space adventure"}, {"name": "Godfather", "description": "mafia drama"}]' > data/movies.json

# 2. Generate embeddings (mock for demo)
cat > samples.json << 'EOF'
[
  [0.1, 0.2, 0.3],
  [0.4, 0.5, 0.6]
]
EOF

cat > query.json << 'EOF'
[0.15, 0.25, 0.35]
EOF

# 3. Run similarity search
RISC0_DEV_MODE=1 cargo run --release -- --execute
# Output: Closest index: 0 (Star Wars is more similar)

# 4. Generate ZK proof
cargo run --release -- --prove
# Output: Proof saved to proof_output_*.json
```

## 🏃‍♂️ Running Modes

### Development Mode
```bash
RISC0_DEV_MODE=1 cargo run --release -- --execute
```
- Fast execution
- No cryptographic proofs
- Good for development/testing

### Production Mode
```bash
cargo run --release -- --prove
```
- Generates ZK proofs
- Slower but verifiable
- Cryptographically secure

### Remote Proving (Bonsai)
```bash
BONSAI_API_KEY="your_key" BONSAI_API_URL="url" cargo run --release -- --prove
```
- Offload proving to Bonsai service
- Faster for large computations

## 📁 Project Structure

```
├── vnns-lib/           # Core similarity search algorithms
├── embedder/           # Text-to-embedding conversion
├── host/               # ZK proving orchestration
├── methods/            # ZK guest circuits
│   └── guest/          # Similarity search in zkVM
├── data/               # Sample datasets
└── target/             # Build artifacts
```

## 🔍 Understanding the Output

When you run the proofs, you'll see:

```
Proving all chunks (batch size 4)
Generating proof for chunk 0.  # Process first 4 samples
Closest index: 2               # Best match in this chunk
Generating proof for chunk 1.  # Process remaining samples
Closest index: 1               # Best match in this chunk
Generating proof for final samples.  # Final comparison
```

Each proof provides cryptographic evidence that:
- The similarity computation was performed correctly
- The input data matches the committed hashes
- The output is the true nearest neighbor

## 🤝 Contributing

This is a demonstration of verifiable vector search. Key areas for extension:

- Support for different distance metrics (cosine, manhattan)
- Approximate nearest neighbor algorithms
- Integration with more embedding models
- Batch proof aggregation for multiple queries

## 📚 Learn More

- [RISC Zero Documentation](https://dev.risczero.com/)
- [Ollama Embeddings](https://github.com/ollama/ollama)
- [Vector Databases Overview](https://pinecone.io/learn/vector-database/)

---

Built with ❤️ using [RISC Zero](https://risczero.com/) zkVM

### Running Proofs Remotely on Bonsai

_Note: The Bonsai proving service is still in early Alpha; an API key is
required for access. [Click here to request access][bonsai access]._

If you have access to the URL and API key to Bonsai you can run your proofs
remotely. To prove in Bonsai mode, invoke `cargo run` with two additional
environment variables:

```bash
BONSAI_API_KEY="YOUR_API_KEY" BONSAI_API_URL="BONSAI_URL" cargo run
```

## How to Create a Project Based on This Template

Search this template for the string `TODO`, and make the necessary changes to
implement the required feature described by the `TODO` comment. Some of these
changes will be complex, and so we have a number of instructional resources to
assist you in learning how to write your own code for the RISC Zero zkVM:

- The [RISC Zero Developer Docs][dev-docs] is a great place to get started.
- Example projects are available in the [examples folder][examples] of
  [`risc0`][risc0-repo] repository.
- Reference documentation is available at [https://docs.rs][docs.rs], including
  [`risc0-zkvm`][risc0-zkvm], [`cargo-risczero`][cargo-risczero],
  [`risc0-build`][risc0-build], and [others][crates].

## Directory Structure

It is possible to organize the files for these components in various ways.
However, in this starter template we use a standard directory structure for zkVM
applications, which we think is a good starting point for your applications.

```text
project_name
├── Cargo.toml
├── host
│   ├── Cargo.toml
│   └── src
│       └── main.rs                    <-- [Host code goes here]
└── methods
    ├── Cargo.toml
    ├── build.rs
    ├── guest
    │   ├── Cargo.toml
    │   └── src
    │       └── method_name.rs         <-- [Guest code goes here]
    └── src
        └── lib.rs
```

## Video Tutorial

For a walk-through of how to build with this template, check out this [excerpt
from our workshop at ZK HACK III][zkhack-iii].

## Questions, Feedback, and Collaborations

We'd love to hear from you on [Discord][discord] or [Twitter][twitter].

[bonsai access]: https://bonsai.xyz/apply
[cargo-risczero]: https://docs.rs/cargo-risczero
[crates]: https://github.com/risc0/risc0/blob/main/README.md#rust-binaries
[dev-docs]: https://dev.risczero.com
[dev-mode]: https://dev.risczero.com/api/generating-proofs/dev-mode
[discord]: https://discord.gg/risczero
[docs.rs]: https://docs.rs/releases/search?query=risc0
[examples]: https://github.com/risc0/risc0/tree/main/examples
[risc0-build]: https://docs.rs/risc0-build
[risc0-repo]: https://www.github.com/risc0/risc0
[risc0-zkvm]: https://docs.rs/risc0-zkvm
[rust-toolchain]: rust-toolchain.toml
[rustup]: https://rustup.rs
[twitter]: https://twitter.com/risczero
[zkhack-iii]: https://www.youtube.com/watch?v=Yg_BGqj_6lg&list=PLcPzhUaCxlCgig7ofeARMPwQ8vbuD6hC5&index=5
[zkvm-overview]: https://dev.risczero.com/zkvm
