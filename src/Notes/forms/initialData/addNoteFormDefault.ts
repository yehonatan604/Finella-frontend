import { TNote } from "../../types/TNote";

export const addNoteFormDefault: TNote = (userId: string) => {
    return {
        userId,
        name: "",
        date: new Date().toISOString().split("T")[0],
        content: "",
        isSticky: false,
        notes: "",
    };
};