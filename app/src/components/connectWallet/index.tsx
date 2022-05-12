import { Button } from "@components";
import { MouseEventHandler } from "react";

type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export const ConnectWallet: React.FunctionComponent<Props> = ({ onClick }) => {
  return <Button onClick={onClick}>Connect to Wallet</Button>;
};
