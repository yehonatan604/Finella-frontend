import { TNote } from "../../types/TNote";

export const addNoteFormDefault: TNote = {
    userId: "",
    name: "",
    date: new Date().toISOString().split("T")[0],
    content: "",
    isSticky: false,
    notes: "",
};