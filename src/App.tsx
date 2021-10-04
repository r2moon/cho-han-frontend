import React from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import MainProvider from "./context/MainProvider";

const App: React.FC = () => {
  return (
    <MainProvider>
      <div>
        <Header />
        <Home />
      </div>
    </MainProvider>
  );
};

export default App;
