import { DateTime } from "luxon";

const formatDate = (value?: string | Date) => {
    if (!value) return "";
    const date = typeof value === "string" ? new Date(value) : value;
    return date.toISOString().split("T")[0].split("-").reverse().join("/");
};

const formatStringDate = (value: string) => {
    return value.split("/").reverse().join("-")
};


const formatDateLuxon = (value?: string | Date | null) => {
    if (!value) return "";

    let dt: DateTime;

    if (typeof value === "string") {
        // Try ISO first
        dt = DateTime.fromISO(value);
        if (!dt.isValid) {
            // Try DD/MM/YYYY
            dt = DateTime.fromFormat(value, "dd/MM/yyyy");
        }
    } else {
        dt = DateTime.fromJSDate(value);
    }

    return dt.isValid ? dt.toFormat("dd/MM/yyyy") : "";
};

const parseToUTCISO = (value: string | Date | null | undefined): string | null => {
    if (!value) return null;

    let dt: DateTime;

    if (typeof value === "string") {
        // Try dd/MM/yyyy first
        dt = DateTime.fromFormat(value, "dd/MM/yyyy", { zone: "local" });
        if (!dt.isValid) {
            // Try ISO fallback
            dt = DateTime.fromISO(value);
        }
    } else {
        dt = DateTime.fromJSDate(value);
    }

    return dt.isValid ? dt.toUTC().toISO() : null;
};


export { formatDate, formatStringDate, formatDateLuxon, parseToUTCISO };