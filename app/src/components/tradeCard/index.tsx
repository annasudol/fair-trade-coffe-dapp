import { Button } from "@components";
import { ProductStatus, Role, TradeCardData } from "@types";
import { truncateAddress } from "@utils";
import React from "react";
import { FC } from "react";
import { WalletSolContext, WalletSolContextType } from "src/context";

export const TradeCard: FC<TradeCardData> = ({ status, id }) => {
  const { user, changeContract, isInitContract } = React.useContext(WalletSolContext) as WalletSolContextType;
  return (
    <div className="glass rounded-lg py-4 px-6 bg-white shadow flex flex-col mt-4">
      <h3 className="font-bold text-sm text-gray-600">ID:{id && truncateAddress(id)}</h3>
      <div className="my-1">
        <p className="font-medium text-gray-900">
          Status: <span className="uppercase">{status}</span>
        </p>
      </div>
      {isInitContract === false && user?.role === Role.farmer && status === ProductStatus.harvested && (
        <Button
          classes="my-4"
          onClick={() =>
            changeContract(user?.role, id, "process", "Processed coffee successfully", "Error with processing coffee")
          }
        >
          Process coffee
        </Button>
      )}
      {user?.role === Role.retailer && status === ProductStatus.processed && (
        <Button
          classes="my-4"
          onClick={() =>
            changeContract(
              user?.role,
              id,
              "forsale",
              "Set coffee for sale successfully",
              "Error with setting coffee for sale"
            )
          }
        >
          ready for sell
        </Button>
      )}
      {user?.role === Role.consumer && status === ProductStatus.forSale && (
        <Button
          classes="my-4"
          onClick={() =>
            changeContract(
              user?.role,
              id,
              "sold",
              "you've just been bought coffee successfully",
              "Error with bought coffee"
            )
          }
        >
          buy coffee
        </Button>
      )}
      {user?.role === Role.retailer && status === ProductStatus.sold && (
        <Button
          classes="my-4"
          onClick={() =>
            changeContract(user?.role, id, "packed", "Coffee has been packed successfully", "Error, please try later")
          }
        >
          pack coffee
        </Button>
      )}
      {user?.role === Role.retailer && status === ProductStatus.packed && (
        <Button
          classes="my-4"
          onClick={() =>
            changeContract(user?.role, id, "shipped", "Coffee has been shipped successfully", "Error, please try later")
          }
        >
          ship coffee
        </Button>
      )}
    </div>
  );
};
