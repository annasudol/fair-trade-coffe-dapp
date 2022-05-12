/* eslint-disable @typescript-eslint/no-explicit-any */
import { web3 } from "@project-serum/anchor";

import genesisAccount from "../../keys/genesisAccount-keypair.json";
import initAccount from "../../keys/initAccount-keypair.json";

export const getKeyFromFile = (secretKey: any) => {
  if (secretKey) {
    const arr = Object.values(secretKey);
    const secret = new Uint8Array(arr as any);
    return web3.Keypair.fromSecretKey(secret);
  }
};

export const getKeys = () => {
  const genesisAccountKey = genesisAccount?._keypair.secretKey && getKeyFromFile(genesisAccount._keypair.secretKey);
  const initAccountKey = initAccount?._keypair.secretKey && getKeyFromFile(initAccount._keypair.secretKey);
  return { genesisAccountKey, initAccountKey };
};
