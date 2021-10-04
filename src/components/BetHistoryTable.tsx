import React, { useState } from "react";
import {
  Stack,
  Grid,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
import { utils, BigNumber } from "ethers";
import { betName, betResult, etherscanLink } from "../utils/formatter";
import useProvider from "../context/useProvider";

const TableHeaders = [
  {
    title: "ID",
    value: "id",
  },
  {
    title: "Player",
    value: "player",
  },
  {
    title: "Amount",
    value: "amount",
  },
  {
    title: "Expected",
    value: "expected",
  },
  {
    title: "Dice1",
    value: "dice1",
  },
  {
    title: "Dice2",
    value: "dice2",
  },
  {
    title: "Result",
    value: "result",
  },
];

const BetHistoryTable: React.FC = () => {
  const { betHistory } = useProvider();

  return (
    <Stack spacing={2}>
      <Typography>{betHistory ? "Bet History" : "Loading..."}</Typography>
      {betHistory && (
        <Grid container>
          <TableContainer>
            <TableHead>
              <TableRow>
                {TableHeaders.map((header) => (
                  <TableCell key={header.title}>{header.title}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {betHistory.map((bet: any, index: number) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <a href={etherscanLink(bet.player)} target="_blank">
                      {bet.player}
                    </a>
                  </TableCell>
                  <TableCell>
                    {utils.formatUnits(bet.amount, 18)} GAME
                  </TableCell>
                  <TableCell>{betName(bet.expected)}</TableCell>
                  <TableCell>{bet.dice1 ? bet.dice1 : ""}</TableCell>
                  <TableCell>{bet.dice2 ? bet.dice2 : ""}</TableCell>
                  <TableCell>
                    {bet.dice1
                      ? betResult(bet.expected, bet.result)
                      : "Pending"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableContainer>
        </Grid>
      )}
    </Stack>
  );
};

export default BetHistoryTable;
