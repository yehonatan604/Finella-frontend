import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import Layout from "./Common/layout/Layout";
import store from "./Core/store/store";
import AppRouter from "./Core/router/AppRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "sweetalert2/src/sweetalert2.scss";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <AppRouter />
          <ToastContainer />
        </Layout>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
