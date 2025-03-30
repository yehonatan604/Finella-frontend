const formatDate = (value?: string | Date) => {
    if (!value) return "";
    const date = typeof value === "string" ? new Date(value) : value;
    return date.toISOString().split("T")[0].split("-").reverse().join("/");
};

const formatStringDate = (value: string) => {
    return value.split("/").reverse().join("/")
};

export { formatDate, formatStringDate };