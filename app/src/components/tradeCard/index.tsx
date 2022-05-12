import { TradeCardData } from "@types";
import { truncateAddress } from "@utils";
import { FC } from "react";

export const TradeCard: FC<TradeCardData> = ({ status, id }) => {
  return (
    <div className="glass rounded-lg py-4 px-6 bg-white shadow flex flex-col mt-4">
      <h3 className="font-bold text-sm text-gray-600">ID:{id && truncateAddress(id)}</h3>
      <div className="my-1">
        <span className="font-medium text-gray-600">Status: {status}</span>
      </div>
    </div>
  );
};
