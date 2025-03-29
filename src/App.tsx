import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import Layout from "./UI/layout/Layout";
import store from "./Core/store/store";
import AppRouter from "./UI/router/AppRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <AppRouter />
        </Layout>
        <ToastContainer />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
