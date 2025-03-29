import { useForm } from "react-hook-form";
import { HTTPMethodTypes } from "../../Core/types/HTTPMethodTypes";
import { useCallback, useEffect, useMemo, useState } from "react";
import useAuth from "../../Auth/hooks/useAuth";
import { TBalanceEntry } from "../types/TBalanceEntry";
import { sendApiRequest } from "../../Core/helpers/sendApiRequest";
import { addBalanceEntryFormDefault } from "../forms/initialData/addBalanceEntryFormDefault copy";

const useBalanceEntry = (isBalanceEntryPage: boolean = false) => {
    const { user } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [fetchedBalanceEntries, setFetchedBalanceEntries] = useState<TBalanceEntry[]>([]);
    const [fromYear, setFromYear] = useState(new Date().getFullYear());
    const [toYear, setToYear] = useState(new Date().getFullYear());
    const [months, setMonths] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const [pickedType, setPickedType] = useState<string>("all");

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<TBalanceEntry>({
        mode: "onChange",
        defaultValues: addBalanceEntryFormDefault,
    });

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
            },
            {
                field: "price",
                headerName: "Price",
                flex: 1,
                headerClassName: "super-app-theme--header",
                sortable: true,
                sortComparator: (v1: number, v2: number, param1: { id: string; }, param2: { id: string; }) => {
                    if (param1.id === "total" || param2.id === "total") return;
                    return v1 - v2;
                },
            },
        ],
        []
    );

    const rows = useMemo(() => {
        const data =
            fetchedBalanceEntries.map((bEntry) => ({
                id: bEntry._id,
                name: bEntry.name,
                date: bEntry.date.split("T")[0].split("-").reverse().join("/"),
                type: bEntry.type,
                price: bEntry.type === "income" ? bEntry.price : `-${bEntry.price}`,
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
    };
}

export default useBalanceEntry;