import { Button } from "@components";
import { ProductStatus, Role, TradeCardData } from "@types";
import { truncateAddress } from "@utils";
import React from "react";
import { FC } from "react";
import { WalletSolContext, WalletSolContextType } from "src/context";

export const TradeCard: FC<TradeCardData> = ({ status, id }) => {
  const { user, changeContract } = React.useContext(WalletSolContext) as WalletSolContextType;
  return (
    <div className="glass rounded-lg py-4 px-6 bg-white shadow flex flex-col mt-4">
      <h3 className="font-bold text-sm text-gray-600">ID:{id && truncateAddress(id)}</h3>
      <div className="my-1">
        <span className="font-medium text-gray-600">Status: {status}</span>
      </div>
      {user?.role === Role.farmer && status === ProductStatus.harvested && (
        <Button
          classes="my-4"
          onClick={() =>
            changeContract(
              user?.role,
              id,
              "processCoffee",
              "Processed Coffee successfully",
              "Error with process coffee"
            )
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
              "setForSaleCoffee",
              "Set coffee for sale successfully",
              "Error with set coffee for sale"
            )
          }
        >
          set ready for sell
        </Button>
      )}
      {user?.role === Role.consumer && status === ProductStatus.forSale && (
        <Button
          classes="my-4"
          onClick={() =>
            changeContract(
              user?.role,
              id,
              "buyCoffee",
              "Coffee has been bought successfully",
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
            changeContract(
              user?.role,
              id,
              "packCoffee",
              "Coffee has been packed successfully",
              "Error, please try later"
            )
          }
        >
          pack coffee
        </Button>
      )}
      {user?.role === Role.retailer && status === ProductStatus.packed && (
        <Button
          classes="my-4"
          onClick={() =>
            changeContract(
              user?.role,
              id,
              "shipCoffee",
              "Coffee has been shipped successfully",
              "Error, please try later"
            )
          }
        >
          ship coffee
        </Button>
      )}
    </div>
  );
};
