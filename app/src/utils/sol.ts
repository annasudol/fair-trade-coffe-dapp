import { Address, Idl, Program, Provider, web3 } from "@project-serum/anchor";
import { clusterApiUrl, Commitment, Connection, PublicKey } from "@solana/web3.js";
import { ProductStatus, Role, TradeCardData } from "@types";

import idl from "../../../target/idl/fair_trade_coffee.json";
export const PROGRAM_KEY = new PublicKey(idl.metadata.address);

type Opts = {
  preflightCommitment: Commitment;
};

// SystemProgram is a reference to the Solana runtime!
const { Keypair } = web3;

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devnet.
const network = clusterApiUrl("devnet");

// Controls how we want to acknowledge when a transaction is "done".
const opts: Opts = {
  preflightCommitment: "processed",
};

export type ExtendedWindow = Window & typeof globalThis & { solana: any };

export const getProvider = (): Provider => {
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new Provider(connection, (window as ExtendedWindow).solana, {
    commitment: opts.preflightCommitment,
  });
  return provider;
};

export const getProgram = (customProvider?: Provider) => {
  const provider = customProvider || getProvider();
  return new Program(idl as Idl, programID, provider);
};

export const getUserKey = (walletKey: string) => {
  const userAccount = Keypair.fromSeed(
    new TextEncoder().encode(`${PROGRAM_KEY.toString().slice(0, 15)}__${walletKey.toString().slice(0, 15)}`)
  );
  return userAccount;
};

export async function getUser(program: Program, walletKey: string) {
  const userAccount = getUserKey(walletKey);
  try {
    const _user = await program.account.userState.fetch(userAccount.publicKey);
  if (_user) {
    const accountType = _user.accountType;
    const user = {
      id: userAccount.publicKey.toString(),
      role: Role[Object.keys(accountType)[0] as Role],
    };

    return user;
  }
  } catch {}
}

export const getProductById = async (tradeId: PublicKey): Promise<TradeCardData | undefined> => {
  const program = getProgram();
  try {
    const product = await program.account.productState.fetch(tradeId);
    if (product) {
      const status = Object.keys(product?.status)[0];
      const productStatus = ProductStatus[status as ProductStatus];
      return {
        id: tradeId.toString(),
        status: productStatus,
        user: product.user.toString(),
        preId: product.preId.toString(),
      };
    }
  } catch (e) {
    console.log(e);
  }
};
