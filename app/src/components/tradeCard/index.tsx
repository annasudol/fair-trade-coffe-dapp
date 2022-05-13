import { Button } from "@components";
import { ProductStatus, Role, TradeCardData } from "@types";
import { truncateAddress } from "@utils";
import React from "react";
import { FC } from "react";
import { WalletSolContext, WalletSolContextType } from "src/context";

export const TradeCard: FC<TradeCardData> = ({ status, id }) => {
  const { user, processCoffee } = React.useContext(WalletSolContext) as WalletSolContextType;
  return (
    <div className="glass rounded-lg py-4 px-6 bg-white shadow flex flex-col mt-4">
      <h3 className="font-bold text-sm text-gray-600">ID:{id && truncateAddress(id)}</h3>
      <div className="my-1">
        <span className="font-medium text-gray-600">Status: {status}</span>
      </div>
      {user?.role === Role.farmer && status === ProductStatus.harvested && (
        <Button classes="my-4" onClick={() => processCoffee && processCoffee(user?.role, id)}>
          Process coffee
        </Button>
      )}
    </div>
  );
};
