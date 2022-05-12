import { getExplorerUrl } from "@config";
import { EndpointTypes } from "@config/getExplorer";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { FC } from "react";

interface TransactionLinkProps {
  txid: string;
}
export const TransactionLink: FC<TransactionLinkProps> = ({ txid }) => {
  const network = WalletAdapterNetwork.Devnet;
  return (
    <a
      className="flex flex-row link link-accent text-main-gray-3"
      href={getExplorerUrl(txid, network as EndpointTypes)}
      rel="noreferrer"
      target="_blank"
    >
      <svg
        className="flex-shrink-0 h-4 ml-2 mt-0.5 text-primary-light w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
      <div className="flex mx-4">
        {txid.slice(0, 8)}...
        {txid.slice(txid.length - 8)}
      </div>
    </a>
  );
};
