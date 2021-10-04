import React from "react";
import Button from "@mui/material/Button";
import useProvider from "../context/useProvider";

const ConnectButton: React.FC = () => {
  const { onboard, address, provider } = useProvider();

  const connectWallet = async () => {
    if (!provider) {
      const walletSelected = await onboard.walletSelect();
      if (!walletSelected) return;
    }
    await onboard.walletCheck();
  };

  const disconnectWallet = async () => {
    await onboard.walletReset();
  };

  return (
    <div>
      {provider && address ? (
        <Button color="inherit" onClick={disconnectWallet}>
          {address.substring(0, 6)}...
          {address.substr(38, 4)}
        </Button>
      ) : (
        <Button color="inherit" onClick={connectWallet}>
          Connect
        </Button>
      )}
    </div>
  );
};

export default ConnectButton;
