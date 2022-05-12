import { Footer, Header, Main, NotificationList } from "@components";
import { appConfig } from "@config";
import { useWallet } from "@hooks";
import { Meta } from "@layout";

import { WalletProvider } from "../src/context";

const Home = () => {
  const { walletAddress, connectWallet } = useWallet();

  return (
    <div className="max-w-7xl mx-auto sm:px-6 flex flex-col items-center justify-center">
      <Meta description={appConfig.description} title={appConfig.title} />
      <WalletProvider walletAddress={walletAddress}>
        <Header connectWallet={connectWallet} walletAddress={walletAddress} />
        <Main />
        <Footer />
        <NotificationList />
      </WalletProvider>
    </div>
  );
};

export default Home;
