import Notify from "bnc-notify";
import Onboard from "bnc-onboard";

const networkId = 4;
const dappId = "ba640424-1ecd-4657-be7e-559600cde485";

export const initOnboard = (subscriptions) => {
  return Onboard({
    dappId,
    hideBranding: false,
    networkId,
    subscriptions,
    walletSelect: {
      wallets: [{ walletName: "metamask" }],
    },
    walletCheck: [
      { checkName: "derivationPath" },
      { checkName: "connect" },
      { checkName: "accounts" },
      { checkName: "network" },
    ],
  });
};

export const initNotify = () => {
  return Notify({ dappId, networkId });
};

export const handleNotify = (globalState, hash, callback) => {
  if (!globalState.notify) {
    return;
  }
  const { emitter } = globalState.notify.hash(hash);
  emitter.on("txPool", (transaction) => {
    return {
      link: `https://etherscan.io/tx/${transaction.hash}`,
    };
  });
  emitter.on("txSent", (data) => console.log("txSent", data));
  emitter.on("txConfirmed", (data) =>
    callback ? callback(true, data) : console.log("txConfirmed", data)
  );
  emitter.on("txSpeedUp", (data) => console.log("txSpeedUp", data));
  emitter.on("txCancel", (data) =>
    callback ? callback(false, data) : console.log("txCancel", data)
  );
  emitter.on("txFailed", (data) =>
    callback ? callback(false, data) : console.log("txFailed", data)
  );
};
