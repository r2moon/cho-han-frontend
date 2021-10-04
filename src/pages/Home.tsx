import React, { useEffect } from "react";
import { Container } from "@mui/material";
import { GamePanel, BetHistoryTable } from "../components";

const Home: React.FC = () => {
  return (
    <Container>
      <GamePanel />
      <BetHistoryTable />
    </Container>
  );
};

export default Home;
