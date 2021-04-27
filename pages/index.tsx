import React, { ReactElement } from "react";
import dynamic from "next/dynamic";
import { Provider } from "react-redux";
import store from "../src/repositories";

const MyApp = dynamic(() => import("../src/app"), { ssr: false });

const Home = (): ReactElement => {
  return (
    <div>
      <div>Homepage</div>
      <Provider store={store}>
        <MyApp />
      </Provider>
    </div>
  );
};

export default Home;
