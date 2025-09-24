"use client"; // Ensures this component is only used on the client side

import { store } from "@/redux/store/store";
import { Provider } from "react-redux";

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
