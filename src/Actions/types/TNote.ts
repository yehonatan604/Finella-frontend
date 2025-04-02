import { TDbItem } from "./TDbItem";

export type TNote = TDbItem & {
    userId: string;
    name: string;
    content: string;
    date: string;
    isSticky: boolean;
    notes: string;
};