import { RegisterTradeForm, TradeCard } from "@components";
import { Role } from "@types";
import { notify } from "@utils";
import * as React from "react";
import { WalletSolContext, WalletSolContextType } from "src/context";

export const Main = () => {
  const { user, tradeList, harvestCoffee } = React.useContext(WalletSolContext) as WalletSolContextType;
  const onHarvestCoffee = async () => {
    try {
      const userID = user?.id;
      if (userID) {
        const tx = await harvestCoffee(user.role);
        tx &&
          notify({
            type: "success",
            message: "Harvested coffee successfully",
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
      {user?.role === Role.farmer && <RegisterTradeForm onSubmit={onHarvestCoffee} />}
      <div className="grid sm:grid-cols-3 sm:gap-1.5 md:grid-cols-4 mb-22">
        {user && tradeList?.length === 0 ? (
          <p className="text-black py-4 text-center">No trades to display</p>
        ) : (
          tradeList?.map(({ id, status, user, preId }) => (
            <TradeCard key={id} id={id} preId={preId} status={status} user={user} />
          ))
        )}
      </div>
    </main>
  );
};
