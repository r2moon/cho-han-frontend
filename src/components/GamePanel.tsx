import React, { useState, useEffect } from "react";
import { utils } from "ethers";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import useProvider from "../context/useProvider";

const GamePanel: React.FC = () => {
  const { bet, hasBet, provider, address, gameBalance } = useProvider();

  const [amount, setAmount] = useState<string>("");
  const [progressing, setProgressing] = useState<boolean>(false);

  const play = async (isCho: boolean) => {
    try {
      setProgressing(true);
      await bet(amount, isCho);
    } catch (err) {
      console.error(err);
    }
    setProgressing(false);
  };

  const hasEnoughGame = () => {
    return !(
      gameBalance &&
      utils.parseUnits(Number(amount).toString(), 18).gt(gameBalance)
    );
  };

  return (
    <Grid container justifyContent="center">
      <Card style={{ minWidth: 400 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Play game
          </Typography>
          {provider && address && (
            <Typography gutterBottom component="div">
              {gameBalance
                ? `You have ${utils.formatUnits(gameBalance, 18)} GAME`
                : "Fetching Balance"}
            </Typography>
          )}
          <TextField
            label="amount"
            variant="standard"
            type="number"
            value={amount}
            style={{ width: "100%" }}
            onChange={(e) => setAmount(e.target.value)}
          />
        </CardContent>
        {provider && address && hasBet && (
          <CardActions style={{ justifyContent: "center" }}>
            <Typography>Has open bet, Please wait</Typography>
          </CardActions>
        )}
        {provider && address && !hasBet && !progressing && !hasEnoughGame() && (
          <CardActions style={{ justifyContent: "center" }}>
            <Typography>Insufficient balance</Typography>
          </CardActions>
        )}
        {provider && address && progressing && (
          <CardActions style={{ justifyContent: "center" }}>
            <Typography>Progressing</Typography>
          </CardActions>
        )}
        {provider && address && !progressing && !hasBet && hasEnoughGame() && (
          <CardActions style={{ justifyContent: "center" }}>
            <Button onClick={() => play(true)}>CHO</Button>
            <Button onClick={() => play(false)}>HAN</Button>
          </CardActions>
        )}
        {(!provider || !address) && (
          <CardActions style={{ justifyContent: "center" }}>
            <Typography>Connect wallet first</Typography>
          </CardActions>
        )}
      </Card>
    </Grid>
  );
};

export default GamePanel;
