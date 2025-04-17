import { Socket } from "socket.io-client";
import { alert } from "../../Common/utilities/alert";
import { entitiesActions } from "../store/entitiesSlice";
import store from "../store/store";


export const registerSocketListeners = (socket: Socket) => {
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

            if (args.id) {
                socket.emit("note-read", { id: args.id });
                store.dispatch(entitiesActions.markNoteAsRead({ id: args.id }));
            }
        });
    });

    socket.on("connect_error", (err) => {
        console.error("❌ connection error:", err.message);
    });
};
