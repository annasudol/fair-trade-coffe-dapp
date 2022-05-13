/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import * as anchor from "@project-serum/anchor";
import { Idl, IdlTypeDef } from "@project-serum/anchor/dist/cjs/idl";
import { IdlTypes, TypeDef } from "@project-serum/anchor/dist/cjs/program/namespace/types";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Role, TradeCardData, UserData } from "@types";
import { getKeys, getProductById, getProgram, getProvider, getUser, getUserKey, notify } from "@utils";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";

const { SystemProgram } = anchor.web3;

export type WalletSolContextType = {
  user?: UserData | null;
  isInitContract?: boolean;
  initContract?: () => Promise<TypeDef<IdlTypeDef, IdlTypes<Idl>> | undefined>;
  signUpUser: (role: Role) => Promise<string | undefined>;
  createTrade: (role: Role) => Promise<string | undefined>;
  tradeList?: TradeCardData[];
};

export const WalletSolContext = React.createContext<WalletSolContextType | null>(null);

type Props = {
  children: React.ReactNode;
  walletAddress?: string;
};
export const WalletProvider: React.FC<Props> = ({ children, walletAddress }) => {
  const [user, setUser] = useState<UserData | null>();
  const [tradeList, setTradeList] = useState<TradeCardData[]>([]);
  const [isInitContract, setIsInitContract] = useState<boolean | undefined>();

  const signUpUser = async (role: Role) => {
    console.log(role, "role");
    if (walletAddress) {
      const program = getProgram();
      const userAccount = getUserKey(walletAddress);
      const provider = getProvider();
      try {
        const tx = await program.rpc.createUser(role, {
          accounts: {
            authority: provider.wallet.publicKey,
            userAccount: userAccount.publicKey,
            systemProgram: SystemProgram.programId,
          },
          signers: [userAccount],
        });
        const user = await getUser(program, walletAddress);
        user && setUser(user);
        return tx;
      } catch (e) {
        notify({
          type: "error",
          message: "Error with sign up user",
        });
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const createTrade = async (role: Role) => {
    if (walletAddress && user) {
      const { initAccountKey } = getKeys();
      if (initAccountKey?.publicKey) {
        const program = getProgram();
        const provider = getProvider();
        if (initAccountKey) {
          try {
            const accountKey = Keypair.generate();

            const tx = await program.rpc.registerTrade(role.toLocaleLowerCase(), {
              accounts: {
                tradeAccount: initAccountKey.publicKey,
                authority: provider.wallet.publicKey,
                userAccount: new PublicKey(user.id),
                productAccount: accountKey.publicKey,
                systemProgram: SystemProgram.programId,
              },
              signers: [accountKey],
            });
            const product = getProductById(accountKey.publicKey);
            product && setTradeList((products) => [product as unknown as TradeCardData, ...products]);
            return tx;
          } catch (e) {
            notify({
              type: "error",
              message: "Error with creating post",
            });
          }
        }
      }
    }
  };

  const fetchUser = useCallback(async (walletAddress: string) => {
    if (walletAddress) {
      const program = getProgram();
      const user = await getUser(program, walletAddress);
      user ? setUser(user) : setUser(null);
      return user;
    }
  }, []);

  const initContract = async () => {
    const { genesisAccountKey, initAccountKey } = getKeys();
    const program = getProgram();
    const provider = getProvider();

    if (initAccountKey && genesisAccountKey) {
      console.log(provider.wallet.publicKey);
      try {
        const txid = await program.rpc.initTrade({
          accounts: {
            tradeAccount: initAccountKey.publicKey,
            genesisTradeAccount: genesisAccountKey.publicKey,
            authority: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
          signers: [initAccountKey, genesisAccountKey],
        });

        const trade = await program.account.tradeState.fetch(initAccountKey.publicKey);
        if (trade) {
          setIsInitContract(false);
          notify({
            type: "success",
            message: "Created init trade",
            txid,
          });
          return trade;
        }
      } catch (e) {
        console.log(e);
        notify({
          type: "error",
          message: "Error, please try later",
        });
      }
    }
  };

  const fetchProducts = async (id: PublicKey) => {
    try {
      const product = await getProductById(id);

      if (product) {
        if (product.preId !== "11111111111111111111111111111111") {
          if (tradeList.length === 0 || !tradeList.some((item) => item.id === product.id)) {
            setTradeList((products) => [...products, product as unknown as TradeCardData]);
            await fetchProducts(new PublicKey(product.preId));
          }
        }
      }
    } catch (e) {
      console.log(e, "e");
    }
  };

  const fetchTrade = useCallback(async (initAccountKey: { publicKey: PublicKey }) => {
    const program = getProgram();
    try {
      const trade = await program.account.tradeState.fetch(initAccountKey.publicKey);
      const id = trade?.currentId;

      id && (await fetchProducts(id));
      return trade;
    } catch (err) {
      setIsInitContract(true);
      notify({
        type: "error",
        message: "Please create initial contract",
      });
    }
  }, []);

  useEffect(() => {
    const onGetUser = async (walletAddress: string) => {
      try {
        const user = await fetchUser(walletAddress);
        // if (user) {
          const { initAccountKey } = getKeys();
          let trade;
          if (initAccountKey) trade = await fetchTrade(initAccountKey);
        console.log(trade, "trade");
          setIsInitContract(!trade);
        // }
      } catch (err) {
        console.log(err, "err");
        notify({
          type: "error",
          message: "Error with get user",
        });
      }
    };
    walletAddress && onGetUser(walletAddress);
  }, [fetchUser, walletAddress]);

  return (
    <WalletSolContext.Provider value={{ user, isInitContract, initContract, signUpUser, createTrade, tradeList }}>
      {children}
    </WalletSolContext.Provider>
  );
};
