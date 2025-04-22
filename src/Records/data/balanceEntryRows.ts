import { formatDate } from "../../Common/helpers/dateTimeHelpers";
import { TBalanceEntry } from "../types/TBalanceEntry";

export const balanceEntryRows = (fetchedBalanceEntries: TBalanceEntry[]) => {
    const data =
        fetchedBalanceEntries.map((bEntry) => ({
            id: bEntry._id,
            name: bEntry.name,
            date: formatDate(bEntry.date),
            type: bEntry.type,
            price: bEntry.type === "income" ? bEntry.price : `-${bEntry.price}`,
            withVat: bEntry.withVat,
            notes: bEntry.notes,
            status: bEntry.status,
        })) || [];

    const totalPrice = data.reduce(
        (total, current) => {
            if (current.status === "inactive") return total;
            return total + Number(current.price)
        },
        0
    );
    return [
        ...data,
        {
            id: "total",
            name: "Total",
            "price": `${totalPrice.toFixed(2)}`,
        },
    ];

}