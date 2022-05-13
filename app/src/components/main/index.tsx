import { RegisterTradeForm, TradeCard } from "@components";
import { Role } from "@types";
import { notify } from "@utils";
import * as React from "react";
import { WalletSolContext, WalletSolContextType } from "src/context";

export const Main = () => {
  const { user, isInitContract, tradeList, createTrade } = React.useContext(WalletSolContext) as WalletSolContextType;
  const onCreateTrade = async () => {
    try {
      const userID = user?.id;
      if (userID) {
        const tx = await createTrade(user.role);
        tx &&
          notify({
            type: "success",
            message: "Signed up user successfully",
            txid: tx as string,
          });
      }
    } catch (e) {
      notify({
        type: "error",
        message: "please try later",
      });
    }
  };
  return (
    <main>
      {isInitContract === false && (
        <div>
          <div>
            {user?.role === Role.farmer && <RegisterTradeForm onSubmit={onCreateTrade} />}
            {tradeList?.length === 0 ? (
              <p className="text-black py-4 text-center">No trades to display</p>
            ) : (
              tradeList?.map(({ id, status, user, preId }) => (
                <TradeCard key={id} id={id} preId={preId} status={status} user={user} />
              ))
            )}
          </div>
        </div>
      )}
    </main>
  );
};
