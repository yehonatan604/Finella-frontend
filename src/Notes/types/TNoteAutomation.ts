import { TDbItem } from "../../Actions/types/TDbItem";

export type TNoteAutomation = TDbItem & {
    userId: string;
    noteId: string;
    dateTime: string;
    repeat: string;
    notes?: string;
    lastTriggeredAt?: string | null;
};