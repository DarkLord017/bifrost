import { zkVerifySession, ZkVerifyEvents, Risc0Version } from "zkverifyjs";
import dotenv from 'dotenv';
import fs from "fs";

dotenv.config();

const proof = JSON.parse(fs.readFileSync("./data/proof_output.json"));

async function main() {
    const session = await zkVerifySession.start().Volta().withAccount(process.env.SEED_PHRASE);
    const regevent = await session.registerVerificationKey().risc0({ version: Risc0Version.V2_2 }).execute(proof.image_id);

    regevent.events.on(ZkVerifyEvents.Finalized, (eventData) => {
        console.log('Registration finalized:', eventData);
        fs.writeFileSync("vkey.json", JSON.stringify({ "hash": eventData.statementHash }, null, 2));
        return eventData.statementHash
    });
}

main();