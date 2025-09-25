//! An end-to-end example of using RISC Zero to generate a proof of VNNS (Vector Neural Network Search)
//! that can be executed or have a proof generated.
//!
//! You can run this script using the following command:
//! ```shell
//! RUST_LOG=info cargo run --release -- --execute
//! ```
//! or
//! ```shell
//! RUST_LOG=info cargo run --release -- --prove
//! ```

use clap::Parser;
use methods::{HASHER_GUEST_ELF, HASHER_GUEST_ID};
use risc0_zkvm::{default_prover, ExecutorEnv, Receipt};
use serde::{Deserialize, Serialize};
use std::{fs::File, io::Write, path::PathBuf};

#[derive(Serialize)]
pub struct Proof {
    proof: String,
    image_id: String,
    pub_inputs: String,
}

#[derive(Deserialize)]
pub struct EmbeddedData<T> {
    pub embeddings: Vec<f32>,
    pub data: T,
}

#[derive(Deserialize)]
pub struct Data {
    // Add fields as needed for your data structure
}

struct AggregationInput {
    pub receipt: Receipt,
}

/// The arguments for the command.
#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
struct Args {
    /// Simulate the execution of the program, without a proof.
    #[clap(long)]
    execute: bool,

    /// Generate batches of proofs.
    #[clap(long)]
    prove: bool,

    /// Path to the samples JSON file.
    #[clap(short, long, default_value = "samples.json")]
    samples_path: PathBuf,

    /// Path to the query JSON file.
    #[clap(short, long, default_value = "query.json")]
    query_path: PathBuf,

    /// Number of samples to be taken for each batch.
    #[clap(long, default_value = "4")]
    batch_size: usize,
}

enum ExecutionType {
    Execute,
    Prove,
}

fn main() {
    // Initialize tracing
    tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::filter::EnvFilter::from_default_env())
        .init();

    let args = Args::parse();

    ////////// Parse execution type.
    if args.execute == args.prove {
        eprintln!("Error: You must specify either --execute or --prove");
        std::process::exit(1);
    }
    let exec_type = if args.execute {
        ExecutionType::Execute
    } else {
        ExecutionType::Prove
    };

    ///////// Setup the prover.
    let prover = default_prover();

    ///////// Setup the inputs.
    // Read samples from JSON file
    println!("Reading samples from: {}", args.samples_path.display());
    let samples_data = std::fs::read_to_string(&args.samples_path)
        .expect("Failed to read samples file");
    let samples: Vec<Vec<f32>> = serde_json::from_str(&samples_data)
        .expect("Failed to parse samples JSON");

    // Read query from JSON file
    println!("Reading query from: {}", args.query_path.display());
    let query_data = std::fs::read_to_string(&args.query_path)
        .expect("Failed to read query file");
    let query: Vec<f32> = serde_json::from_str(&query_data)
        .expect("Failed to parse query JSON");

    println!("Loaded {} samples and query with {} dimensions", samples.len(), query.len());

    match exec_type {
        ExecutionType::Execute => {
            // pass everything at once for execution
            let env = ExecutorEnv::builder()
                .write(&samples)
                .unwrap()
                .write(&query)
                .unwrap()
                .build()
                .unwrap();

            // Execute the program (in dev mode, this just executes without proving)
            println!("Executing program in dev mode.");
            let prove_info = prover.prove(env, HASHER_GUEST_ELF).unwrap();
            let receipt = prove_info.receipt;
            println!("Program executed successfully.");

            // Read the output from journal using proper deserialization
            let journal = &receipt.journal;

            let idx: u32 = journal.decode().unwrap();
            let query_commit: Vec<u8> = journal.decode().unwrap();
            let samples_commit: Vec<u8> = journal.decode().unwrap();
            let output_commit: Vec<u8> = journal.decode().unwrap();

            println!("Closest index: {}", idx);
            println!("Query Commitment: {}", hex::encode(&query_commit));
            println!("Samples Commitment: {}", hex::encode(&samples_commit));
            println!("Output Commitment: {}", hex::encode(&output_commit));

            let expected_idx = vnns_lib::compute_best_sample(&samples, &query);
            assert_eq!(idx, expected_idx as u32);
            println!("Values are correct!");

            // Record performance info
            println!("Execution completed successfully.");
        }
        ExecutionType::Prove => {
            // generate similarity proofs
            println!("Proving all chunks (batch size {})", args.batch_size);
            let mut receipts = Vec::new();
            let mut current_samples = samples;

            while current_samples.len() > args.batch_size {
                // we will collect the best samples for this iteration here
                let mut best_samples = Vec::new();

                // process each chunk within the current samples
                for (chunk_idx, chunk) in current_samples.chunks(args.batch_size).enumerate() {
                    println!("Generating proof for chunk {}.", chunk_idx);
                    let env = ExecutorEnv::builder()
                        .write(&chunk)
                        .unwrap()
                        .write(&query)
                        .unwrap()
                        .build()
                        .unwrap();

                    // create proof
                    let prove_info = prover.prove(env, HASHER_GUEST_ELF).unwrap();
                    let receipt = prove_info.receipt;

                    // find idx from the journal and choose the best sample
                    let journal = &receipt.journal;
                    let idx: u32 = journal.decode().unwrap();
                    let query_commit: Vec<u8> = journal.decode().unwrap();
                    let samples_commit: Vec<u8> = journal.decode().unwrap();
                    let output_commit: Vec<u8> = journal.decode().unwrap();

                    println!("Closest index: {}", idx);
                    println!("Query Commitment: {}", hex::encode(&query_commit));
                    println!("Samples Commitment: {}", hex::encode(&samples_commit));
                    println!("Output Commitment: {}", hex::encode(&output_commit));

                    best_samples.push(idx);

                    // store receipt for aggregation
                    receipts.push(receipt);
                }

                // update samples with the results of each chunk
                current_samples = best_samples
                    .iter()
                    .map(|&idx| current_samples[idx as usize].clone())
                    .collect::<Vec<_>>();
            }

            // all sub-chunks are processed, do one more final proof
            {
                println!("Generating proof for final samples.");
                let env = ExecutorEnv::builder()
                    .write(&current_samples)
                    .unwrap()
                    .write(&query)
                    .unwrap()
                    .build()
                    .unwrap();

                let prove_info = prover.prove(env, HASHER_GUEST_ELF).unwrap();
                let receipt = prove_info.receipt;

                let journal = &receipt.journal;
                let _idx: u32 = journal.decode().unwrap();
                let query_commit: Vec<u8> = journal.decode().unwrap();
                let samples_commit: Vec<u8> = journal.decode().unwrap();
                let output_commit: Vec<u8> = journal.decode().unwrap();

                println!("Query Commitment: {}", hex::encode(&query_commit));
                println!("Samples Commitment: {}", hex::encode(&samples_commit));
                println!("Output Commitment: {}", hex::encode(&output_commit));

                // verify the receipt to be sure
                receipt.verify(HASHER_GUEST_ID).unwrap();

                receipts.push(receipt);
            }

            // save all receipts to file
            for (i, receipt) in receipts.iter().enumerate() {
                println!("Saving proof {}.", i);

                let mut bin_receipt = Vec::new();
                ciborium::into_writer(&receipt, &mut bin_receipt).unwrap();
                let image_id_hex = hex::encode(
                    HASHER_GUEST_ID
                        .into_iter()
                        .flat_map(|v| v.to_le_bytes().into_iter())
                        .collect::<Vec<_>>(),
                );
                let receipt_journal_bytes_array = &receipt.journal.bytes;

                let proof = Proof {
                    proof: "0x".to_string() + &hex::encode(&bin_receipt),
                    image_id: "0x".to_string() + &image_id_hex,
                    pub_inputs: "0x".to_string() + &hex::encode(&receipt_journal_bytes_array),
                };

                let json_string = serde_json::to_string_pretty(&proof).unwrap();
                let mut file = File::create(format!("proof_output_{}.json", i)).unwrap();
                file.write_all(json_string.as_bytes()).unwrap();
            }

            println!("Successfully generated all proofs!");
        }
    }
}
