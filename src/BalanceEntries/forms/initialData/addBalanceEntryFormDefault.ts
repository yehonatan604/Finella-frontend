import { TBalanceEntry } from "../../types/TBalanceEntry";

export const addBalanceEntryFormDefault = (userId: string): TBalanceEntry => ({
    userId,
    name: "",
    date: new Date().toISOString().split("T")[0],
    type: "expense",
    price: 0,
    notes: "",
});