import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PublicKey } from "@solana/web3.js";

export type ExploreUrlTypes = "tx" | "address" | "block";
export type EndpointTypes = "localnet" | WalletAdapterNetwork;

export function getExplorerUrl(
  viewTypeOrItemAddress: "inspector" | PublicKey | string,
  network: EndpointTypes = WalletAdapterNetwork.Devnet,
  itemType: ExploreUrlTypes = "tx"
): string {
  const getClusterUrlParam = () => {
    let cluster = "";
    if (network === "localnet") cluster = `custom&customUrl=${encodeURIComponent("http://127.0.0.1:8899")}`;
    else if (network === WalletAdapterNetwork.Mainnet) cluster;
    else cluster = `?cluster=${network}`;
    return cluster;
  };
  return `https://explorer.solana.com/${itemType}/${viewTypeOrItemAddress}${getClusterUrlParam()}`;
}
