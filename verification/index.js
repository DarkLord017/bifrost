import { zkVerifySession, ZkVerifyEvents, Risc0Version } from "zkverifyjs";
import dotenv from 'dotenv';
import fs from "fs";

dotenv.config();

const proof = JSON.parse(fs.readFileSync("./data/proof_output.json"));

async function main() {
    const session = await zkVerifySession.start().Volta().withAccount(process.env.SEED_PHRASE);

    let statement, aggregationId;
    session.subscribe([
        {
            event: ZkVerifyEvents.NewAggregationReceipt,
            callback: async (eventData) => {
                console.log("New aggregation receipt:", eventData);
                if (aggregationId == parseInt(eventData.data.aggregationId.replace(/,/g, ''))) {
                    let statementpath = await session.getAggregateStatementPath(
                        eventData.blockHash,
                        parseInt(eventData.data.domainId),
                        parseInt(eventData.data.aggregationId.replace(/,/g, '')),
                        statement
                    );
                    console.log("Statement path:", statementpath);
                    const statementproof = {
                        ...statementpath,
                        domainId: parseInt(eventData.data.domainId),
                        aggregationId: parseInt(eventData.data.aggregationId.replace(/,/g, '')),
                    };
                    fs.writeFileSync("aggregation.json", JSON.stringify(statementproof));
                }
            },
            options: { domainId: 0 },
        },
    ]);

    const vkey = session.registerVerificationKey().risc0({ version: Risc0Version.V2_2 });

    console.log("vKey: ", vkey);

    const { events } = await session.verify().risc0({ version: Risc0Version.V2_2 })
        .execute({
            proofData: {
                proof: proof.proof,
                vk: proof.image_id,
                publicSignals: proof.pub_inputs,
            }, domainId: 0
        })

    events.on(ZkVerifyEvents.IncludedInBlock, (eventData) => {
        console.log("Included in block", eventData);
        statement = eventData.statement;
        aggregationId = eventData.aggregationId;
    })
}

main();