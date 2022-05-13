/* eslint-disable @typescript-eslint/no-explicit-any */
// import { PublicKey } from "@solana/web3.js";

export enum ACCOUNT_ERROR {
  NOT_CREATED = "NOT_CREATED",
}
export enum Role {
  consumer = "consumer",
  farmer = "farmer",
  retailer = "retailer",
}

export enum ProductStatus {
  harvested = "harvested",
  processed = "processed",
  forSale = "forSale",
  sold = "sold",
  packed = "packed",
  shipped = "shipped",
}

export interface UserData {
  role: Role;
  id: string;
}
export interface TradeCardData {
  id: string;
  preId: string;
  status: ProductStatus;
  user: string;
}

export type UseWallet = () => {
  walletAddress?: string;
  connectWallet: () => Promise<void>;
};

export type ExtendedWindow = Window & typeof globalThis & { solana: any };
