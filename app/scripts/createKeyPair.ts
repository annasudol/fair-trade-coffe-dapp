import * as anchor from "@project-serum/anchor";
import * as fs from "fs";

const initAccount = anchor.web3.Keypair.generate();
const genesisAccount = anchor.web3.Keypair.generate();

fs.writeFileSync("./keys/initAccount-keypair.json", JSON.stringify(initAccount));
fs.writeFileSync("./keys/genesisAccount-keypair.json", JSON.stringify(genesisAccount));
