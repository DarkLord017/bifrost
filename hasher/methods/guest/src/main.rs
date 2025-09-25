#![no_main]

use risc0_zkvm::guest::env;
use sha2::{Digest, Sha256};
use vnns_lib::compute_best_sample;

risc0_zkvm::guest::entry!(main);

pub fn main() {
    // Read the samples and query from the host
    let samples: Vec<Vec<f32>> = env::read();
    let query: Vec<f32> = env::read();

    // compute similarity and return index
    let idx = compute_best_sample(&samples, &query);

    // commit to output
    let output_bytes = samples[idx as usize]
        .iter()
        .flat_map(|f| f.to_ne_bytes())
        .collect::<Vec<_>>();
    let output_commit = Sha256::digest(&output_bytes);

    // commit to query
    let query_bytes = query
        .iter()
        .flat_map(|f| f.to_ne_bytes())
        .collect::<Vec<_>>();
    let query_commit = Sha256::digest(&query_bytes);

    // commit to samples
    let samples_bytes = samples
        .iter()
        .flatten()
        .flat_map(|f| f.to_ne_bytes())
        .collect::<Vec<_>>();
    let samples_commit = Sha256::digest(&samples_bytes);

    // Write the outputs to the journal in RISC Zero format
    env::commit(&(idx as u32)); // 4 bytes (u32)
    env::commit(&query_commit.to_vec()); // 32 bytes
    env::commit(&samples_commit.to_vec()); // 32 bytes
    env::commit(&output_commit.to_vec()); // 32 bytes
}
