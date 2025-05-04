import { TDbItem } from "../../Common/types/TDbItem";

export type TNote = TDbItem & {
    userId: string;
    name: string;
    content: string;
    date: string;
    isSticky: boolean;
    notes: string;
    noteStatus: "PENDING" | "READ" | "ARCHIVED";
};