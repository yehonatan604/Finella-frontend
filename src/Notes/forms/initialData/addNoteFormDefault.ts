import { TNote } from "../../types/TNote";

export const addNoteFormDefault = (userId: string): TNote => {
    return {
        userId,
        name: "",
        date: new Date().toISOString().split("T")[0],
        content: "",
        isSticky: false,
        notes: "",
        noteStatus: "PENDING",
    };
};