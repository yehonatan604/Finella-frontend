import { createSlice } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import { WritableDraft } from "immer";
import { alert } from "../utilities/alert";

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
                const socket = io("http://localhost:4387");
                state.socket = socket as unknown as WritableDraft<Socket>;
                state.connected = true;

                socket.on("connect", () => {
                    console.log("🟢 Socket connected:", socket.id);
                });

                const token = localStorage.getItem("token");
                if (token) {
                    const { _id } = JSON.parse(atob(token.split(".")[1]));
                    socket.emit("register-user", _id);
                }

                socket.on("user-registered", (id) => {
                    console.log("✅ User registered on socket, user:", id);
                });

                socket.on("disconnect", () => {
                    console.log("🔴 Socket disconnected");
                    state.connected = false;
                });

                socket.on("note-automation-triggered", (args) => {
                    console.log("🔔 Note Automation Triggered:", args);
                    alert("Note Automation Triggered",
                        `Note Automation Triggered for note: ${args.noteId} automationId: ${args.automationId}, msg: ${args.msg}`,
                        "warning",
                    );
                });
            }
        },

        disconnectSocket: (state) => {
            if (state.socket) {
                state.socket.disconnect();
                state.socket = null;
                state.connected = false;
            }
        },
    },
});

export type TSocketSlice = typeof initialState;
export const socketActions = socketSlice.actions;
export default socketSlice.reducer;
