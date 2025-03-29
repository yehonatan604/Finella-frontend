import { TBalanceEntry } from "../../types/TBalanceEntry";

export const addBalanceEntryFormDefault: TBalanceEntry = {
    userId: "",
    name: "",
    date: new Date().toISOString().split("T")[0],
    type: "expense",
    price: 0,
    withVat: false,
    isPayed: false,
    notes: "",
};