import { useState, useCallback, useEffect } from "react";
import useAuth from "../../Auth/hooks/useAuth";
import { sendApiRequest } from "../../Common/helpers/sendApiRequest";
import { HTTPMethodTypes } from "../../Common/types/HTTPMethodTypes";
import { TNote } from "../types/TNote";
import { TNoteAutomation } from "../types/TNoteAutomation";

const useNoteAutomation = () => {
    const { user } = useAuth();
    const [noteAutomations, setNoteAutomations] = useState<TNoteAutomation[]>([]);
    const [allNotes, setAllNotes] = useState<TNote[]>([]);
    const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);

    const addNoteAutomation = useCallback(() => {
        setNoteAutomations((prev) => [
            ...prev,
            {
                _id: `temp-${Date.now()}`, // a unique temp ID
                userId: user?._id || "",
                noteId: "",
                dateTime: new Date().toISOString().slice(0, 16),
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
                if (automation._id?.startsWith("temp-")) {
                    delete automation._id; // Remove the temp ID
                    await sendApiRequest("/note-automations", HTTPMethodTypes.POST, {
                        ...automation,
                        userId: user?._id,
                    });
                } else {
                    await sendApiRequest(`/note-automations`, HTTPMethodTypes.PUT, automation);
                }
            });
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    }, [noteAutomations, user?._id]);

    return {
        noteAutomations,
        allNotes,
        showAddNoteDialog,
        setShowAddNoteDialog,
        addNoteAutomation,
        handleSaveChanges,
        setNoteAutomations,
    }
}

export default useNoteAutomation;