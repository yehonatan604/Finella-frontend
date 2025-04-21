import { TDbItem } from "./TDbItem";

export type TBalanceEntry = TDbItem & {
    userId: string;
    name: string;
    date: string;
    type: "income" | "expense";
    price: number;
    withVat: boolean;
    isPayed: boolean;
    notes: string;
};  