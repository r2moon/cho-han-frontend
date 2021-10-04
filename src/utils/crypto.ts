import { ethers, BigNumber, Contract, constants } from "ethers";
import Erc20Abi from "../contracts/abis/ERC20";

export const approveToken = async (
  provider: null | ethers.providers.Web3Provider,
  address: null | string,
  token: string,
  spender: string,
  amount: BigNumber
): Promise<void> => {
  if (!provider || !address) {
    return;
  }

  const signer = await provider.getSigner();
  const tokenContract = new Contract(token, Erc20Abi, signer);

  const allowance = await tokenContract.allowance(address, spender);
  if (allowance.lt(amount)) {
    const tx = await tokenContract.approve(spender, constants.MaxUint256);
    await tx.wait(1);
  }
};
