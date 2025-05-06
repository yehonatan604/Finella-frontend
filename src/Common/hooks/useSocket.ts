import { useCallback, useEffect } from "react";
import { alert } from "../utilities/alert";
import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "../../Core/store/store";
import { socketActions } from "../../Core/store/socketSlice";
import { TUser } from "../../Auth/types/TUser";
import { entitiesActions } from "../../Core/store/entitiesSlice";

const useSocket = (user: TUser) => {
    const socket = useSelector((state: TRootState) => state.socketSlice.socket);
    const dispatch = useDispatch();

    const noteAutomationTriggered = useCallback((args: {
        title: string;
        content: string;
    }) => {
        alert(args.title, args.content, "info")
    }, []);

    const unreadNotesTotalChanged = useCallback((args: {
        title: string;
        content: string;
        noteId: string;
    }) => {
        alert(args.title, args.content, "info");
        dispatch(entitiesActions.updateEntityItem({
            type: "notes",
            item: { _id: args.noteId, unread: true },
            id: args.noteId,
        }));
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            dispatch(socketActions.connectSocket());
            socket?.on("note-automation-triggered", noteAutomationTriggered);

            return () => {
                socket?.off("note-automation-triggered", noteAutomationTriggered);
            };
        } else {
            dispatch(socketActions.disconnectSocket());
        }
    }, [user, dispatch, socket, noteAutomationTriggered, unreadNotesTotalChanged]);
}

export default useSocket;