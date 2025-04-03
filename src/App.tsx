import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import Layout from "./Common/layout/Layout";
import store from "./Common/store/store";
import AppRouter from "./Common/router/AppRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "sweetalert2/src/sweetalert2.scss";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { Button } from "@mui/material";

const socket = io("http://localhost:4387");

const App = () => {
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    socket.on("task-updated", (data) => {
      console.log("Task was updated:", data);
    });

    return () => {
      socket.off("connect");
      socket.off("task-updated");
    };
  }, []);

  const completeTask = (taskId: string) => {
    socket.emit("complete-task", taskId);
  };

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Button
          variant="contained"
          onClick={() => completeTask("taskId")}
          sx={{
            pt: 10,
            px: "50%",
            width: 200,
          }}
        >
          Test
        </Button>
        <Layout>
          <AppRouter />
          <ToastContainer />
        </Layout>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
