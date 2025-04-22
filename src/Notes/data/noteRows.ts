import { formatDate } from "../../Common/helpers/dateTimeHelpers";
import { TNote } from "../types/TNote";

export const noteRows = (notes: TNote[]) => {
    return (
        notes?.map((note) => ({
            id: note._id,
            name: note.name,
            content: note.content,
            date: formatDate(note.date),
            isSticky: note.isSticky ?? false,
            notes: note.notes,
            status: note.status,
        })) || []
    );
};