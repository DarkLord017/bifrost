# VNNS Runbook (Step-by-Step)

This runbook gives a concise, copy-pasteable sequence to set up embeddings with Ollama and run the similarity search in dev or proving mode.

Paths below assume repository root: `hasher/`.

## 1) Prerequisites

- Rust toolchain (see `rust-toolchain.toml` managed by `cargo`)
- Homebrew (macOS)
- Network access to download Ollama and the embedding model

## 2) Install and Start Ollama

```bash
# Install
brew install ollama

# Start as background service (recommended)
brew services start ollama

# Verify it’s running
curl -sS http://localhost:11434/api/version
```

Expected: a JSON response like `{ "version": "0.12.x" }`.

## 3) Pull the Embedding Model

The default model used by the embedder (`embedder/src/main.rs`) is `all-minilm:latest` (dim 384).

```bash
ollama pull all-minilm:latest
```

You can swap models later by passing `--model <name>` to the embedder commands.

## 4) Build the Workspace

From the repo root `hasher/`:

```bash
cargo build --release
```

## 5) Prepare/Inspect Your Data

Your dataset should be a JSON array of objects with `{ name, description }`, e.g. `data/movies.json`:

```json
[
  { "name": "Star Wars", "description": "A space adventure ..." },
  { "name": "The Godfather", "description": "Mafia family ..." }
]
```

## 6) Generate Embeddings (Index)

This invokes the `vnns-embedder` binary to embed each item in your dataset using Ollama:

```bash
cargo run --bin vnns-embedder -- index -p data/movies.json
# Optional: specify a model
# cargo run --bin vnns-embedder -- index -p data/movies.json --model all-minilm:latest
```

Outputs (same directory as your input file):
- `data/movies.index.json` — full index with data and metadata
- `data/movies.samples.json` — embeddings only (used by the host)

## 7) Generate a Query Vector

```bash
cargo run --bin vnns-embedder -- query -p data/movies.json -t "space adventure with heroes"
# Optional: specify a model
# cargo run --bin vnns-embedder -- query -p data/movies.json -t "..." --model all-minilm:latest
```

Output:
- `data/movies.query.json` — the query embedding vector

## 8) Run Similarity Search (Dev Mode)

Dev mode is fast and does not generate cryptographically valid proofs (good for iteration).

```bash
RISC0_DEV_MODE=1 cargo run --release --bin host -- \
  --execute \
  --samples-path data/movies.samples.json \
  --query-path data/movies.query.json
```

Expected output includes:
- `Closest index: <n>` — index of the nearest sample in `samples`
- Some commitment lines (dev receipts are not valid for production)

### Mapping `Closest index` back to data
- `Closest index: 0` means the first item in your dataset is the closest match.
- The order corresponds to the embedding order produced from your input JSON (`data/movies.json`).
- To see the matched record, open `data/movies.index.json` and inspect the element at that index (or look at the same position in your original `data/movies.json`).

## 9) Run with Zero-Knowledge Proofs (Proving Mode)

This generates valid receipts and proof files.

```bash
cargo run --release --bin host -- \
  --prove \
  --samples-path data/movies.samples.json \
  --query-path data/movies.query.json \
  --batch-size 4
```

Outputs:
- `proof_output_*.json` — proof objects containing:
  - `proof`: serialized receipt bytes (hex, prefixed with 0x)
  - `image_id`: guest image id (hex)
  - `pub_inputs`: journal bytes (hex) including the public commitments

## 10) Switching Models (Optional)

You can choose other embedding models supported by Ollama. Examples mentioned in `embedder/src/main.rs`:
- `all-minilm:latest` (dim 384) — default
- `nomic-embed-text:latest` (dim 768)
- `mxbai-embed-large:latest` (dim 1024)

If you switch models, re-run both index and query so vector dimensions match.

```bash
ollama pull nomic-embed-text:latest
cargo run --bin vnns-embedder -- index -p data/movies.json --model nomic-embed-text:latest
cargo run --bin vnns-embedder -- query -p data/movies.json -t "your query" --model nomic-embed-text:latest
```

## 11) Troubleshooting

- "Couldn’t connect to server":
  - Ensure Ollama is running: `brew services start ollama`
  - Check: `curl -sS http://localhost:11434/api/version`
- Model dimension mismatch:
  - Re-run both `index` and `query` with the same `--model`.
- Slow builds:
  - Use `--release` for host/guest consistency. First build will be the slowest.
- Dev vs Prove:
  - Dev (`--execute` + `RISC0_DEV_MODE=1`) is fast but not a valid proof.
  - Prove (`--prove`) generates verifiable proofs suitable for sharing.

## 12) One-Liner Recap

```bash
# 1) Start Ollama and pull model
brew services start ollama && ollama pull all-minilm:latest

# 2) Build
cargo build --release

# 3) Index + Query
cargo run --bin vnns-embedder -- index -p data/movies.json
cargo run --bin vnns-embedder -- query -p data/movies.json -t "space adventure with heroes"

# 4) Run (Dev)
RISC0_DEV_MODE=1 cargo run --release --bin host -- --execute \
  --samples-path data/movies.samples.json --query-path data/movies.query.json

# 5) Run (Prove)
cargo run --release --bin host -- --prove \
  --samples-path data/movies.samples.json --query-path data/movies.query.json --batch-size 4
```
