/* eslint-disable no-console */
// import { PublicKey } from "@solana/web3.js";
import { UseWallet } from "@types";
import { useEffect, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtendedWindow = Window & typeof globalThis & { solana: any };

export const useWallet: UseWallet = () => {
  const [walletAddress, setWalletAddress] = useState<string>();

  /*
   * This function holds the logic for deciding if a Phantom Wallet is
   * connected or not
   */
  const checkIfWalletIsConnected = async (): Promise<void> => {
    try {
      const { solana } = window as ExtendedWindow;

      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found!");

          /*
           * The solana object gives us a function that will allow us to connect
           * directly with the user's wallet!
           */
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log("Connected with Public Key:", response.publicKey.toString());

          /*
           * Set the user's publicKey in state to be used later!
           */
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana object not found! Get a Phantom Wallet 👻");
      }
    } catch (error) {
      console.error(error);
    }
  };

  /*
   * Let's define this method so our code doesn't break.
   * We will write the logic for this next!
   */
  const connectWallet = async () => {
    const { solana } = window as ExtendedWindow;

    if (solana) {
      const response = await solana.connect();
      // eslint-disable-next-line no-console
      console.log("Connected with Public Key:", response.publicKey.toString(), response, "res");
      setWalletAddress(response.publicKey.toString());
    }
  };

  /*
   * When our component first mounts, let's check to see if we have a connected
   * Phantom Wallet
   */
  useEffect(() => {
    window.addEventListener("load", checkIfWalletIsConnected);
    return () => window.removeEventListener("load", checkIfWalletIsConnected);
  }, []);

  return { walletAddress, connectWallet };
};
