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
  harvestCoffee: (role: Role) => Promise<string | undefined>;
  tradeList?: TradeCardData[];
  changeContract: (
    role: Role,
    productId: string,
    rpvValue: string,
    successMessage: string,
    errorMessage: string
  ) => Promise<string | undefined>;
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
    if (walletAddress) {
      const program = getProgram();
      const userAccount = getUserKey(walletAddress);
      const provider = getProvider();
      try {
        const tx = await program.rpc.createUser(role.toString(), {
          accounts: {
            authority: provider.wallet.publicKey,
            userAccount: userAccount.publicKey,
            systemProgram: SystemProgram.programId,
          },
          signers: [userAccount],
        });
        const user = await getUser(program, walletAddress);

        if (user) {
          setUser(user);
          await onGetTrade();
        }
        return tx;
      } catch (e) {
        notify({
          type: "error",
          message: "Error with sign up user",
        });
      }
    }
  };

  const harvestCoffee = async (role: Role) => {
    if (walletAddress && user) {
      const { initAccountKey } = getKeys();
      if (initAccountKey?.publicKey) {
        const program = getProgram();
        const provider = getProvider();
        if (initAccountKey) {
          try {
            const accountKey = Keypair.generate();
            const tx = await program.rpc.harvestCoffee(role.toLocaleLowerCase(), {
              accounts: {
                tradeAccount: initAccountKey.publicKey,
                authority: provider.wallet.publicKey,
                userAccount: new PublicKey(user.id),
                productAccount: accountKey.publicKey,
                systemProgram: SystemProgram.programId,
              },
              signers: [accountKey],
            });
            const product = await getProductById(accountKey.publicKey);
            product && setTradeList((products) => [product as unknown as TradeCardData, ...products]);
            return tx;
          } catch (e) {
            notify({
              type: "error",
              message: "Error with harvest coffee",
            });
          }
        }
      }
    }
  };

  const changeContract = async (
    role: Role,
    productId: string,
    change: string,
    successMessage: string,
    errorMessage: string
  ) => {
    if (user) {
      const program = getProgram();
      const provider = getProvider();

      try {
        const txid = await program.rpc.changeCoffeeContract(role.toLocaleLowerCase(), change, {
          accounts: {
            authority: provider.wallet.publicKey,
            productAccount: new PublicKey(productId),
          },
        });
        const product = await getProductById(new PublicKey(productId));
        const list = tradeList.filter((item) => item.id !== productId);
        setTradeList([product as unknown as TradeCardData, ...list]);
        notify({
          type: "success",
          message: successMessage,
          txid,
        });
        return txid;
      } catch (e) {
        notify({
          type: "error",
          message: errorMessage,
        });
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
        setTradeList((products) => [...products, product as unknown as TradeCardData]);
        !tradeList.some((item) => item.id === product.preId) && (await fetchProducts(new PublicKey(product.preId)));
      }
    } catch (e) {
      console.log(e);
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

  const onGetTrade = useCallback(async () => {
    try {
      const { initAccountKey } = getKeys();
      let trade;
      if (initAccountKey) trade = await fetchTrade(initAccountKey);
      setIsInitContract(!trade);
    } catch (err) {
      console.log(err);
      notify({
        type: "error",
        message: "Error with get user",
      });
    }
  }, []);

  useEffect(() => {
    const onGetUser = async (walletAddress: string) => {
      const program = getProgram();

      const user = await getUser(program, walletAddress);
      if (user) {
        setUser(user);
        onGetTrade();
      } else {
        setUser(null);
      }
    };

    walletAddress && onGetUser(walletAddress);
  }, [fetchUser, walletAddress]);

  return (
    <WalletSolContext.Provider
      value={{
        user,
        isInitContract,
        initContract,
        signUpUser,
        harvestCoffee,
        tradeList,

        changeContract,
      }}
    >
      {children}
    </WalletSolContext.Provider>
  );
};
