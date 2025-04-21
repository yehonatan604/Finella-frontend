import { useState, useCallback, useEffect } from "react";
import useAuth from "../../Auth/hooks/useAuth";
import { sendApiRequest } from "../../Common/helpers/sendApiRequest";
import { HTTPMethodTypes } from "../../Common/types/HTTPMethodTypes";
import { TNote } from "../types/TNote";
import { TNoteAutomation } from "../types/TNoteAutomation";
import { DateTime } from "luxon";
import { useSelector } from "react-redux";
import { TRootState } from "../../Core/store/store";
import { alert } from "../../Common/utilities/alert";

const useNoteAutomation = () => {
    const { user } = useAuth();
    const { socket } = useSelector((state: TRootState) => state.socketSlice);
    const [noteAutomations, setNoteAutomations] = useState<TNoteAutomation[]>([]);
    const [allNotes, setAllNotes] = useState<TNote[]>([]);
    const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);

    const addNoteAutomation = useCallback(() => {
        const now = DateTime.local().startOf("minute");
        const nowUTC = now.toUTC().toISO({ suppressMilliseconds: true }) || "";

        setNoteAutomations((prev) => [
            ...prev,
            {
                _id: `temp-${Date.now()}`,
                userId: user?._id || "",
                noteId: "",
                dateTime: nowUTC,
                repeat: "none",
                notes: "",
                lastTriggeredAt: null,
                status: "active",
            },
        ]);
    }, [user?._id]);

    useEffect(() => {
        const fetchNoteAutomations = async () => {
            try {
                const resAutomations = await sendApiRequest(
                    "/note-automations",
                    HTTPMethodTypes.GET
                );
                const resNotes = await sendApiRequest("/note", HTTPMethodTypes.GET);
                if (resAutomations && resNotes) {
                    setNoteAutomations(resAutomations.data);
                    setAllNotes(resNotes.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchNoteAutomations();
    }, []);

    const handleSaveChanges = useCallback(async () => {
        try {
            noteAutomations.forEach(async (automation) => {
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
                    await sendApiRequest("/note-automations", HTTPMethodTypes.POST, {
                        ...converted,
                        userId: user?._id,
                    });
                } else {
                    await sendApiRequest(`/note-automations`, HTTPMethodTypes.PUT, converted);
                }
            });
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    }, [noteAutomations, user?._id]);

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
        noteAutomations,
        allNotes,
        showAddNoteDialog,
        setShowAddNoteDialog,
        addNoteAutomation,
        handleSaveChanges,
        setNoteAutomations,
    };
};

export default useNoteAutomation;