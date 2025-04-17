import { createSlice } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import { WritableDraft } from "immer";
import { alert } from "../../Common/utilities/alert";

type TSocketState = {
    socket: Socket | null;
    connected: boolean;
};

const initialState: TSocketState = {
    socket: null,
    connected: false,
};

const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        connectSocket: (state) => {
            if (!state.socket) {
                const token = localStorage.getItem("token");
                if (!token) return;

                const socket = io("http://localhost:4387", {
                    auth: { token },
                });

                state.socket = socket as unknown as WritableDraft<Socket>;
                state.connected = true;

                const connectionEvents = ["connect", "disconnect"];
                const alertEvents = ["note-automation-triggered", "todo-failed"];

                connectionEvents.forEach((event) => {
                    socket.on(event, () => {
                        console.log(`${event === "connect" ? "✅" : "❌"} ${event}ed`);
                    });
                });

                alertEvents.forEach((event) => {
                    socket.on(event, (args) => {
                        alert(args.title, args.content, "info");
                    });
                });

                socket.on("connect_error", (err) => {
                    console.error("❌ connection error:", err.message);
                });
            }
        },

        disconnectSocket: (state) => {
            if (state.socket) {
                state.socket.disconnect();
                state.socket.removeAllListeners();
                state.socket = null;
                state.connected = false;
            }
        }
    },
});

export type TSocketSlice = typeof initialState;
export const socketActions = socketSlice.actions;
export default socketSlice.reducer;
