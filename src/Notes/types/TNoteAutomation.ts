import { TDbItem } from "../../Actions/types/TDbItem";

export type TNoteAutomation = TDbItem & {
    noteId: string;
    dateTime: string;
    repeat: string;
    notes?: string;
    lastTriggeredAt?: string | null;
};