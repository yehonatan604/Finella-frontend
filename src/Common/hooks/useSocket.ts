import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "../../Core/store/store";
import { socketActions } from "../../Core/store/socketSlice";
import { TUser } from "../../Auth/types/TUser";
import { entitiesActions } from "../../Core/store/entitiesSlice";
import { question } from "../utilities/question";
import { toastify } from "../utilities/toast";

const useSocket = (user: TUser) => {
    const dispatch = useDispatch();
    const {
        socketSlice: { socket },
        entitiesSlice: { notes, todos },
    } = useSelector((state: TRootState) => state);

    const todoFailed = useCallback(
        async (args: { title: string; content: string; id: string, noteId: string }) => {
            try {
                const todo = todos?.find((todo) => todo._id === args.id);
                await question(
                    args.title,
                    args.content + "<br /><br />" + "Mark Note as Read?",
                    "warning",
                    () => {
                        const note = notes?.find((note) => note._id === args.noteId);
                        entitiesActions.updateEntityItem({
                            type: "notes",
                            id: args.noteId,
                            item: { ...note, noteStatus: "READ" },
                        });
                    }
                );
                dispatch(entitiesActions.updateEntityItem({
                    type: "todos",
                    id: args.id,
                    item: { ...todo, todoStatus: "FAILED" },
                }));
            } catch (error) {
                console.error("Error marking todo as failed:", error);
                toastify.error("Error updating todo status");
            }
        },
        [dispatch, notes, todos]
    );

    const noteAutomationTriggered = useCallback(async (args: {
        title: string;
        content: string;
        noteId: string;
    }) => {
        await question(
            args.title,
            args.content + "<br /><br />" + "Mark as Read?",
            "info",
            () => {
                const note = notes?.find((note) => note._id === args.noteId);
                entitiesActions.updateEntityItem({
                    type: "notes",
                    id: args.noteId,
                    item: { ...note, noteStatus: "READ" },
                });
            }
        );
    }, [notes]);

    useEffect(() => {
        if (user) {
            dispatch(socketActions.connectSocket());
            socket?.on("note-automation-triggered", noteAutomationTriggered);
            socket?.on("todo-failed", todoFailed);

            return () => {
                socket?.off("note-automation-triggered", noteAutomationTriggered);
                socket?.off("todo-failed", todoFailed);
            };
        } else {
            dispatch(socketActions.disconnectSocket());
        }
    }, [user, dispatch, socket, noteAutomationTriggered, todoFailed]);
}

export default useSocket;