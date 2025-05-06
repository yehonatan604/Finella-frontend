import { useState, useCallback, useEffect } from "react";
import useAuth from "../../Auth/hooks/useAuth";
import { sendApiRequest } from "../../Common/helpers/sendApiRequest";
import { HTTPMethodTypes } from "../../Common/types/HTTPMethodTypes";
import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "../../Core/store/store";
import { alert } from "../../Common/utilities/alert";
import { entitiesActions } from "../../Core/store/entitiesSlice";
import { TNoteAutomation } from "../types/TNoteAutomation";
import { toastify } from "../../Common/utilities/toast";
import { DateTime } from "luxon";

const useNoteAutomation = () => {
    const { user } = useAuth();
    const { socket } = useSelector((state: TRootState) => state.socketSlice);
    const { noteAutomations, notes } = useSelector(
        (state: TRootState) => state.entitiesSlice
    );
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);

    const addNoteAutomation = useCallback(() => {
        const now = DateTime.local().startOf("minute");
        const nowUTC = now.toUTC().toISO({ suppressMilliseconds: true }) || "";

        dispatch(entitiesActions.addEntityItem({
            type: "noteAutomations",
            item: {
                _id: `temp-${Date.now()}`,
                userId: user?._id || "",
                noteId: "",
                dateTime: nowUTC,
                repeat: "none",
                notes: "",
                lastTriggeredAt: null,
                status: "active",
            },
        }));
    }, [user?._id, dispatch]);

    useEffect(() => {
        const fetchNoteAutomations = async () => {
            try {
                setLoading(true);
                const resAutomations = await sendApiRequest(
                    "/note-automations",
                    HTTPMethodTypes.GET
                );

                if (!notes) {
                    const resNotes = await sendApiRequest("/note", HTTPMethodTypes.GET);
                    dispatch(entitiesActions.setEntity({
                        type: "notes",
                        data: resNotes.data || [],
                    }));
                }

                dispatch(entitiesActions.setEntity({
                    type: "noteAutomations",
                    data: resAutomations.data || [],
                }));
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNoteAutomations();
    }, [notes, dispatch]);

    const handleSaveChanges = useCallback(async (noteAutomations: TNoteAutomation[]) => {
        try {
            setLoading(true);
            noteAutomations?.forEach(async (automation: TNoteAutomation) => {
                const converted = {
                    ...automation,
                    dateTime: DateTime.fromISO(automation.dateTime, {
                        zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    })
                        .toUTC()
                        .toISO({ suppressMilliseconds: true }) || automation.dateTime,
                };

                if (automation._id?.startsWith("temp-")) {
                    delete converted._id;
                    const res = await sendApiRequest("/note-automations", HTTPMethodTypes.POST, {
                        ...converted,
                        userId: user?._id,
                    });
                    dispatch(entitiesActions.addEntityItem({
                        type: "noteAutomations",
                        item: res.data,
                    }));
                } else {
                    await sendApiRequest(`/note-automations`, HTTPMethodTypes.PUT, converted);
                    dispatch(entitiesActions.updateEntityItem({
                        type: "noteAutomations",
                        item: converted,
                        id: converted._id,
                    }));
                }
            });
            toastify.success("Changes saved successfully.");
        } catch (error) {
            console.error("Error saving changes:", error);
        } finally {
            setLoading(false);
        }
    }, [dispatch, user?._id]);

    const noteAutomationTriggered = useCallback((args: {
        title: string;
        content: string;
    }) => {
        alert(args.title, args.content, "info")
    }, []);

    useEffect(() => {
        socket?.on("note-automation-triggered", noteAutomationTriggered);

        return () => {
            socket?.off("note-automation-triggered", noteAutomationTriggered);
        };
    }, [socket, noteAutomations, noteAutomationTriggered]);

    return {
        notes,
        noteAutomations,
        showAddNoteDialog,
        setShowAddNoteDialog,
        addNoteAutomation,
        handleSaveChanges,
        loading,
    };
};

export default useNoteAutomation;