import { useForm } from "react-hook-form";
import { HTTPMethodTypes } from "../../Core/types/HTTPMethodTypes";
import { useCallback, useEffect, useMemo, useState } from "react";
import useAuth from "../../Auth/hooks/useAuth";
import { TBalanceEntry } from "../types/TBalanceEntry";
import { sendApiRequest } from "../../Core/helpers/sendApiRequest";
import { addBalanceEntryFormDefault } from "../forms/initialData/addBalanceEntryFormDefault copy";
import { TDataGridInputCellParams } from "../types/TDataGridInputCellParams";
import { createDataGridInputCell } from "../helpers/createDataGridInputCell";
import { toastify } from "../../UI/utilities/toast";
import { formatDate } from "../../Core/helpers/dateHelpers";
import { fixPriceString } from "../../Core/helpers/stringHelpers";
import { createRowIcons } from "../helpers/createRowIcons";

const useBalanceEntry = (isBalanceEntryPage: boolean = false) => {
    const { user } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [fetchedBalanceEntries, setFetchedBalanceEntries] = useState<TBalanceEntry[]>([]);
    const [fromYear, setFromYear] = useState(new Date().getFullYear());
    const [toYear, setToYear] = useState(new Date().getFullYear());
    const [months, setMonths] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const [pickedType, setPickedType] = useState<string>("all");
    const [selectedBEntry, setSelectedBEntry] = useState<TBalanceEntry | null>(null);
    const [isBEntryDetailsDialogOpen, setIsBEntryDetailsDialogOpen] = useState(false);

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<TBalanceEntry>({
        mode: "onChange",
        defaultValues: addBalanceEntryFormDefault,
    });

    const onUpdate = useCallback(
        async (data: TBalanceEntry) => {
            try {
                setLoading(true);
                setError(null);

                const fixedPrice = data.price.toString().includes("-")
                    ? fixPriceString(data.price + "")
                    : data.price;

                await sendApiRequest(`/balance-entry`, HTTPMethodTypes.PUT, {
                    ...data,
                    userId: user?._id,
                    price: fixedPrice,
                });

                setFetchedBalanceEntries((prev) =>
                    prev.map((bEntry) => {
                        const fixedPrice = bEntry.price.toString().includes("-")
                            ? fixPriceString(bEntry.price + "")
                            : bEntry.price;

                        const fixedBEntry = {
                            ...bEntry,
                            price: +fixedPrice,
                        };

                        return (bEntry._id === data._id ? fixedBEntry : bEntry)
                    })
                );
                toastify.success("Balance Entry updated successfully");
            } catch (error) {
                console.log(error);
                toastify.error("Error updating Balance Entry");

                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError(error as string);
                }
            } finally {
                setLoading(false);
            }
        },
        [user?._id]
    );

    const onCellUpdate = useMemo(
        () =>
            (
                row: TBalanceEntry & {
                    id: string | undefined;
                }
            ) => {
                const fetchedRow = fetchedBalanceEntries.find((bEntry) => bEntry._id === row.id);

                const fields = ["name", "date", "type", "price", "withVat", "notes"] as const;

                const normalizeRow = (row: Partial<TBalanceEntry>) => {
                    return {
                        name: row?.name,
                        date: typeof row?.date === "string" && row?.date?.includes("T")
                            ? formatDate(row?.date)
                            : row?.date,
                        type: row?.type,
                        price: row?.price,
                        withVat: row?.withVat,
                        notes: row?.notes ?? ""
                    };
                };

                const checkFetchedRow = normalizeRow(fetchedRow as TBalanceEntry);
                const checkRow = normalizeRow(row);

                const isEqual = fields.every((field) => checkFetchedRow[field] === checkRow[field]);

                if (isEqual) return;

                const finalRow = {
                    _id: row.id,
                    userId: fetchedRow?.userId,
                    name: row.name ?? fetchedRow?.name ?? "",
                    date: new Date(
                        (row.date ?? fetchedRow?.date ?? "").split("/").reverse().join("-")
                    ),
                    type: row.type ?? fetchedRow?.type ?? "income",
                    price: Number(row.price ?? fetchedRow?.price ?? 0),
                    withVat: row.withVat ?? fetchedRow?.withVat,
                    notes: row.notes ?? fetchedRow?.notes ?? "",
                };
                onUpdate(finalRow as unknown as TBalanceEntry);

                setFetchedBalanceEntries((prev) =>
                    prev.map((bEntry) => {
                        if (bEntry._id === row.id) {
                            return finalRow as unknown as TBalanceEntry;
                        }
                        return bEntry;
                    })
                );
            },
        [fetchedBalanceEntries, onUpdate]
    );

    const onDelete = useCallback(
        async (id: string) => {
            try {
                setLoading(true);
                setError(null);
                await sendApiRequest(`/balance-entry/${id}`, HTTPMethodTypes.DELETE, { userId: user?._id });
                setFetchedBalanceEntries((prev) => prev.filter((bEntry) => bEntry._id !== id));
                toastify.success("Balance Entry deleted successfully");
            } catch (error) {
                console.log(error);
                toastify.error("Error deleting Balance Entry");

                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError(error as string);
                }
            } finally {
                setLoading(false);
            }
        }, [user?._id]);

    const columns = useMemo(
        () => [
            {
                field: "name",
                headerName: "Name",
                flex: 1,
                headerClassName: "super-app-theme--header",
                sortable: true,
                sortComparator: (v1: string, v2: string, param1: { id: string; }, param2: { id: string; }) => {
                    if (param1.id === "total" || param2.id === "total") return;
                    return v1.localeCompare(v2);
                },
                editable: true,
                renderCell: (params: TDataGridInputCellParams) => {
                    if (params.row.id === "total") return params.value;
                    return createDataGridInputCell(params, onCellUpdate, "name");
                },
            },
            {
                field: "date",
                headerName: "Date",
                flex: 1,
                headerClassName: "super-app-theme--header",
                sortable: true,
                sortComparator: (v1: string, v2: string, param1: { id: string; }, param2: { id: string; }) => {
                    if (param1.id === "total" || param2.id === "total") return;
                    return v1.localeCompare(v2);
                },
                editable: true,
                renderCell: (params: TDataGridInputCellParams) => {
                    if (params.row.id === "total") return params.value;
                    return createDataGridInputCell(params, onCellUpdate, "date", "date");
                },
            },
            {
                field: "type",
                headerName: "Type",
                flex: 1,
                headerClassName: "super-app-theme--header",
                sortable: true,
                sortComparator: (v1: string, v2: string, param1: { id: string; }, param2: { id: string; }) => {
                    if (param1.id === "total" || param2.id === "total") return;
                    return v1.localeCompare(v2);
                },
                editable: true,
                renderCell: (params: TDataGridInputCellParams) => {
                    if (params.row.id === "total") return params.value;
                    return createDataGridInputCell(params, onCellUpdate, "type", "select", ["income", "expense"]);
                },
            },
            {
                field: "price",
                headerName: "Price",
                flex: .5,
                headerClassName: "super-app-theme--header",
                sortable: true,
                sortComparator: (v1: number, v2: number, param1: { id: string; }, param2: { id: string; }) => {
                    if (param1.id === "total" || param2.id === "total") return;
                    return v1 - v2;
                },
                editable: true,
                renderCell: (params: TDataGridInputCellParams) => {
                    if (params.row.id === "total") return params.value;
                    return createDataGridInputCell(params, onCellUpdate, "price", "number");
                },
            },
            {
                field: "options",
                headerName: "Options",
                flex: .4,
                headerClassName: "super-app-theme--header",
                sortable: false,
                editable: false,
                renderCell: (params: TDataGridInputCellParams) => {
                    if (params.row.id === "total") return;
                    return createRowIcons(() => {
                        setSelectedBEntry(fetchedBalanceEntries.find((bEntry) => bEntry._id === params.id) ?? null);
                        setIsBEntryDetailsDialogOpen(true)
                    }, () => {
                        onDelete(params.id as string);
                    });
                },
            }
        ],
        [onCellUpdate, fetchedBalanceEntries, onDelete]
    );

    const rows = useMemo(() => {
        const data =
            fetchedBalanceEntries.map((bEntry) => ({
                id: bEntry._id,
                name: bEntry.name,
                date: formatDate(bEntry.date),
                type: bEntry.type,
                price: bEntry.type === "income" ? bEntry.price : `-${bEntry.price}`,
                withVat: bEntry.withVat,
                notes: bEntry.notes,
            })) || [];

        const totalPrice = data.reduce(
            (total, current) => total + Number(current.price),
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
    }, [fetchedBalanceEntries]);

    const onSubmit = async (data: TBalanceEntry) => {
        try {
            setLoading(true);
            setError(null);
            await sendApiRequest(`/balance-entry`, HTTPMethodTypes.POST, { ...data, userId: user?._id });
        } catch (error) {
            console.log(error);

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(error as string);
            }
        } finally {
            setLoading(false);
        }
    };

    const getBalanceEntries = useCallback(async (query: string) => {
        try {
            const response = await sendApiRequest("/balance-entry/by" + query, HTTPMethodTypes.GET);
            setFetchedBalanceEntries(response.data);
        }
        catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        if (!isBalanceEntryPage) return;
        const fetchData = async () => {
            const queryParams = new URLSearchParams();

            if (pickedType) {
                queryParams.append("type", pickedType === "all" ? "" : pickedType);
            }

            if (fromYear) {
                queryParams.append("fromYear", fromYear.toString());
            }

            if (toYear) {
                queryParams.append("toYear", toYear.toString());
            }

            if (months.length > 0 && months.length < 12) {
                queryParams.append("months", months.join(","));
            }

            const queryString = queryParams.toString();
            await getBalanceEntries(`?${queryString}`);
        };

        fetchData();
    }, [fromYear, toYear, months, pickedType, isBalanceEntryPage, getBalanceEntries]);

    return {
        register,
        handleSubmit,
        onSubmit,
        onUpdate,
        error,
        errors,
        loading,
        columns,
        rows,
        fromYear,
        setFromYear,
        toYear,
        setToYear,
        months,
        setMonths,
        pickedType,
        setPickedType,
        fetchedBalanceEntries,
        setFetchedBalanceEntries,
        selectedBEntry,
        setSelectedBEntry,
        isBEntryDetailsDialogOpen,
        setIsBEntryDetailsDialogOpen,
    };
}

export default useBalanceEntry;