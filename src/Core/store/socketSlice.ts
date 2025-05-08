import { createSlice } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import { WritableDraft } from "immer";
import { capitalizeFirstLetter } from "../../Common/helpers/stringHelpers";
const { VITE_BASE_API_URL: API_URL } = import.meta.env;

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

                const socket = io(API_URL, {
                    auth: { token },
                });

                state.socket = socket as unknown as WritableDraft<Socket>;
                state.connected = true;

                const connectionEvents = ["connect", "disconnect"];

                connectionEvents.forEach((event) => {
                    socket.on(event, () => {
                        console.log(`${event === "connect" ? "✅" : "❌"} ${capitalizeFirstLetter(event)}ed`);
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
