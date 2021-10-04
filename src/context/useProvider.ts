import { useContext } from "react";
import { Context, MainContext } from "./MainProvider";

const useProvider = (): MainContext => useContext(Context);

export default useProvider;
