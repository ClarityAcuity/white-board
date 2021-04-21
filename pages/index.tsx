import React, { ReactElement } from "react";
import { Provider } from "react-redux";
import App from "../src/app";
import store from "../src/repositories";

const Home = (): ReactElement => {
  return (
    <div>
      <div>Homepage</div>
      <Provider store={store}>
        <App />
      </Provider>
    </div>
  );
};

export default Home;
