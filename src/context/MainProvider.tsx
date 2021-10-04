/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useEffect } from "react";
import { BigNumber, ethers, Contract, utils } from "ethers";
import { gql } from "@apollo/client";
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { DICE_ADDRESS, GAME_TOKEN_ADDRESS } from "../contracts/address";
import Erc20Abi from "../contracts/abis/ERC20";
import DiceAbi from "../contracts/abis/Dice";
import { initNotify, initOnboard } from "../utils/walletConnector";
import { approveToken } from "../utils/crypto";

export interface MainContext {
  onboard: any;
  notify: any;
  provider: null | ethers.providers.Web3Provider;
  address: null | string;
  gameBalance: null | BigNumber;
  betHistory: null | any;
  hasBet: boolean;
  updateGameBalance: () => void;
  updateBetHistory: () => void;
  bet: (humanAmount: string, isCho: boolean) => void;
}

export const Context = createContext<MainContext>({
  onboard: null,
  notify: null,
  provider: null,
  address: null,
  gameBalance: null,
  betHistory: null,
  hasBet: false,
  updateGameBalance: () => {},
  updateBetHistory: () => {},
  bet: () => {},
});

interface Props {
  children: React.ReactNode;
}

const MainProvider: React.FC<Props> = ({ children }: Props) => {
  const [onboard, setOnboard] = useState<any>(null);
  const [notify, setNotify] = useState<any>(null);
  const [provider, setProvider] =
    useState<null | ethers.providers.Web3Provider>(null);
  const [address, setAddress] = useState<null | string>(null);
  const [gameBalance, setGameBalance] = useState<null | BigNumber>(null);
  const [betHistory, setBetHistory] = useState<any>(null);
  const [hasBet, setHasBet] = useState<boolean>(false);
  const [apolloClient] = useState<ApolloClient<NormalizedCacheObject>>(
    new ApolloClient({
      uri: "https://api.thegraph.com/subgraphs/name/ryuheimat/cho-han",
      cache: new InMemoryCache({ resultCaching: false }),
    })
  );
  const [timer, setTimer] = useState<any>(null);

  const updateGameBalance = async () => {
    if (provider && address) {
      const tokenContract = new Contract(
        GAME_TOKEN_ADDRESS,
        Erc20Abi,
        provider
      );

      const balance = await tokenContract.balanceOf(address);
      setGameBalance(balance);
    }
  };

  const updateBetHistory = async () => {
    try {
      const query = address
        ? `first: 10, orderBy: betTime, orderDirection: desc, where: {player: "${address.toLowerCase()}"}`
        : "first: 10, orderBy: betTime, orderDirection: desc";
      const res = await apolloClient.query({
        query: gql`
          query Bets {
            bets(
              ${query}
            ) {
              player {
                id
              }
              amount
              expected
              dice1
              dice2
              result
            }
          }
        `,
        fetchPolicy: "network-only",
      });

      setBetHistory(
        res.data.bets.map((betInfo: any) => {
          return {
            ...betInfo,
            amount: BigNumber.from(betInfo.amount),
            player: betInfo.player.id,
          };
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const bet = async (humanAmount: string, isCho: boolean) => {
    if (!provider || !address) {
      return;
    }

    const amountBN = utils.parseUnits(humanAmount, 18);
    const signer = await provider.getSigner();

    try {
      await approveToken(
        provider,
        address,
        GAME_TOKEN_ADDRESS,
        DICE_ADDRESS,
        amountBN
      );

      const diceContract = new Contract(DICE_ADDRESS, DiceAbi, signer);

      const tx = await diceContract.bet(amountBN, isCho ? 0 : 1);
      await tx.wait(1);
      setHasBet(true);
      updateBetHistory();
      updateGameBalance();
    } catch (err) {
      console.error(err);
    }
  };

  const updateHasBet = async () => {
    if (!provider || !address) {
      return;
    }

    const diceContract = new Contract(DICE_ADDRESS, DiceAbi, provider);
    const requestId = await diceContract.betRequestId(address);

    setHasBet(
      requestId !==
        "0x0000000000000000000000000000000000000000000000000000000000000000"
    );
  };

  useEffect(() => {
    if (
      hasBet ||
      (betHistory && betHistory.length > 0 && betHistory[0].dice1 === 0)
    ) {
      if (!timer) {
        setTimer(
          setInterval(() => {
            updateBetHistory();
            updateHasBet();
          }, 1000)
        );
      }
    } else {
      if (timer) {
        clearInterval(timer);
        setTimer(null);
      }
    }
  }, [hasBet, betHistory, timer]);

  useEffect(() => {
    setOnboard(
      initOnboard({
        address: setAddress,
        wallet: (wallet: any) => {
          if (wallet.provider) {
            setProvider(new ethers.providers.Web3Provider(wallet.provider));
          } else {
            setProvider(null);
          }
        },
      })
    );
    setNotify(initNotify());
    updateBetHistory();
  }, []);

  useEffect(() => {
    updateGameBalance();
    updateHasBet();
    updateBetHistory();
  }, [address, provider]);

  return (
    <Context.Provider
      value={{
        onboard,
        notify,
        provider,
        address,
        gameBalance,
        betHistory,
        hasBet,
        updateGameBalance,
        updateBetHistory,
        bet,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default MainProvider;
