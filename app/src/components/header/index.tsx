import { Button, ConnectWallet, SelectForm } from "@components";
import { Role } from "@types";
import { notify, truncateAddress } from "@utils";
import * as React from "react";
import { WalletSolContext, WalletSolContextType } from "src/context";
interface Props {
  walletAddress?: string;
  connectWallet: () => Promise<void>;
}
export const Header: React.FunctionComponent<Props> = ({ walletAddress, connectWallet }) => {
  const { user, isInitContract, initContract, signUpUser } = React.useContext(WalletSolContext) as WalletSolContextType;
  const onSignUpUser = async (role: Role) => {
    try {
      const tx = await signUpUser(role);
      tx &&
        notify({
          type: "success",
          message: "Signed up user successfully",
          txid: tx as string,
        });
    } catch (e) {
      notify({
        type: "error",
        message: "please try later",
      });
    }
  };
  return (
    <header className="pt-8 flex flex-col items-center">
      {!walletAddress ? (
        <ConnectWallet onClick={connectWallet} />
      ) : (
        <>
          <h3 className="font-bold text-gray-600 capitalize">Connected: @{truncateAddress(walletAddress)}</h3>
          {user === undefined && (
            <div className="mt-16">
              <svg className="animate-spin h-12 w-12 text-white mr-1" viewBox="0 0 24 24">
                <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" fill="#1d4ed8" />
              </svg>
            </div>
          )}
          {user === null && <SelectForm onSubmit={onSignUpUser} />}
          {user && <p className="font-bold">Logged in as {user?.role}</p>}
          {isInitContract && <Button onClick={() => initContract && initContract()}>Init new contract</Button>}
        </>
      )}
    </header>
  );
};
