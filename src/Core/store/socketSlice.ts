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

                // Now move listeners OUTSIDE of reducer to avoid stale proxy issues
                socket.on("connect", () => {
                    console.log("🟢 Socket connected:", socket.id);
                });

                socket.on("user-registered", (id) => {
                    console.log("✅ User registered on socket, user:", id);
                });

                socket.on("disconnect", () => {
                    console.log("🔴 Socket disconnected");
                    // Don't touch Redux state here!
                });

                socket.on("note-automation-triggered", (args) => {
                    alert(args.title, args.content, "warning");
                });

                socket.on("connect_error", (err) => {
                    console.error("❌ Socket connection error:", err.message);
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
