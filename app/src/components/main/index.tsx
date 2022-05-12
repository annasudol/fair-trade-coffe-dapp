import { RegisterTradeForm, TradeCard } from "@components";
import { notify } from "@utils";
import * as React from "react";
import { WalletSolContext, WalletSolContextType } from "src/context";

export const Main = () => {
  const { user, isInitContract, tradeList, createTrade } = React.useContext(WalletSolContext) as WalletSolContextType;
  const onCreatePost = async () => {
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
      {isInitContract === false && <RegisterTradeForm onSubmit={onCreatePost} />}
      <div className="grid sm:grid-cols-3 sm:space-x-2 sm: space-x-3 md:grid-cols-4 lg:grid-cols-6">
        {tradeList?.map(({ id, status, user, preId }) => (
          <TradeCard key={id} id={id} preId={preId} status={status} user={user} />
        ))}
      </div>
    </main>
  );
};
