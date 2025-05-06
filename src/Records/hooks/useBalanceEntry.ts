import { HTTPMethodTypes } from "../../Common/types/HTTPMethodTypes";
import { useCallback, useEffect, useMemo, useState } from "react";
import useAuth from "../../Auth/hooks/useAuth";
import { TBalanceEntry } from "../types/TBalanceEntry";
import { sendApiRequest } from "../../Common/helpers/sendApiRequest";
import { TDataGridInputCellParams } from "../types/TDataGridInputCellParams";
import { toastify } from "../../Common/utilities/toast";
import { formatDate } from "../../Common/helpers/dateTimeHelpers";
import { fixPriceString } from "../../Common/helpers/stringHelpers";
import { balanceEntryCols } from "../data/balanceEntryCols";
import { balanceEntryRows } from "../data/balanceEntryRows";
import { question } from "../../Common/utilities/question";
import { TRootState } from "../../Core/store/store";
import { useSelector, useDispatch } from "react-redux";
import { entitiesActions } from "../../Core/store/entitiesSlice";
import { defaultPageSize, paginatedRows } from "../../Common/helpers/paginationHelpers";

const useBalanceEntry = () => {
    const { user } = useAuth();
    const fetchedBalanceEntries = useSelector((state: TRootState) => state.entitiesSlice.balanceEntries);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [fromYear, setFromYear] = useState(new Date().getFullYear());
    const [toYear, setToYear] = useState(new Date().getFullYear());
    const [months, setMonths] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const [pickedType, setPickedType] = useState<string>("all");
    const [selectedBEntry, setSelectedBEntry] = useState<TBalanceEntry | null>(null);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [search, setSearch] = useState<string>("");
    const [showInactive, setShowInactive] = useState(false);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: defaultPageSize,
    });

    const onUpdate = useCallback(
        async (data: TBalanceEntry) => {
            try {
                setLoading(true);

                const fixedPrice = data.price.toString().includes("-")
                    ? fixPriceString(data.price + "")
                    : data.price;

                const finalData = {
                    ...data,
                    userId: user?._id,
                    price: fixedPrice,
                };

                await sendApiRequest(`/balance-entry`, HTTPMethodTypes.PUT, finalData);

                dispatch(entitiesActions.updateEntityItem({ type: "balanceEntries", item: finalData, id: data._id! }));
                toastify.success("Balance Entry updated successfully");
            } catch (error) {
                console.log(error);
                toastify.error("Error updating Balance Entry");
            } finally {
                setLoading(false);
            }
        },
        [dispatch, user?._id]
    );

    const onCellUpdate = useMemo(
        () =>
            (
                row: TBalanceEntry & {
                    id: string | undefined;
                }
            ) => {
                const fetchedRow = fetchedBalanceEntries?.find((bEntry) => bEntry._id === row.id);

                const fields = ["name", "date", "type", "price", "withVat", "notes"] as const;

                const normalizeRow = (row: Partial<TBalanceEntry>) => {
                    return {
                        name: row?.name,
                        date: typeof row?.date === "string" && row?.date?.includes("T")
                            ? formatDate(row?.date)
                            : row?.date,
                        type: row?.type,
                        price: row?.price,
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
                    notes: row.notes ?? fetchedRow?.notes ?? "",
                };
                onUpdate(finalRow as unknown as TBalanceEntry);

                const finalBentries: TBalanceEntry[] = (fetchedBalanceEntries ?? []).map((bEntry) => {
                    if (bEntry._id === row.id) {
                        return finalRow as unknown as TBalanceEntry;
                    }
                    return bEntry;
                });

                dispatch(entitiesActions.setEntity({ type: "balanceEntries", data: finalBentries }));
                toastify.success("Balance Entry updated successfully");
            },
        [dispatch, fetchedBalanceEntries, onUpdate]
    );

    const onDelete = useCallback(
        async (id: string) => {
            try {
                setLoading(true);
                await question(
                    "Delete Balance Entry",
                    "Are you sure you want to delete this Balance Entry?",
                    "warning",
                    async () => {
                        dispatch(entitiesActions.setLoading(true));
                        await sendApiRequest(`/balance-entry/${id}`, HTTPMethodTypes.DELETE, { userId: user?._id });
                        dispatch(entitiesActions.removeEntityItem({ type: "balanceEntries", id }));
                        toastify.success("Balance Entry deleted successfully");
                    }
                );
            } catch (error) {
                console.log(error);
                toastify.error("Error deleting Balance Entry");
            } finally {
                setLoading(false);
            }
        }, [dispatch, user?._id]);

    const onUndelete = useCallback(
        async (id: string) => {
            try {
                setLoading(true);
                await question(
                    "Undelete Balance Entry",
                    "Are you sure you want to undelete this Balance Entry?",
                    "warning",
                    async () => {
                        dispatch(entitiesActions.setLoading(true));
                        await sendApiRequest(`/balance-entry/undelete/${id}`, HTTPMethodTypes.PATCH, { userId: user?._id });
                        dispatch(entitiesActions.undeleteEntityItem({ type: "balanceEntries", id }));
                        toastify.success("Balance Entry undeleted successfully");
                    }
                );
            } catch (error) {
                console.log(error);
                toastify.error("Error undeleting Balance Entry");
            } finally {
                setLoading(false);
            }
        }
        , [user?._id, dispatch]);

    const onSubmit = useCallback(async (data: TBalanceEntry) => {
        try {
            setLoading(true);
            const newBentry = await sendApiRequest(`/balance-entry`, HTTPMethodTypes.POST, { ...data, userId: user?._id, notes: data.notes ?? "" });
            dispatch(entitiesActions.addEntityItem({ type: "balanceEntries", item: newBentry.data }));
            toastify.success("Balance Entry added successfully");
        } catch (error) {
            console.log(error);
            toastify.error("Error adding Balance Entry");
        } finally {
            setLoading(false);
        }
    }, [dispatch, user?._id]);

    const getBalanceEntries = useCallback(async (query: string) => {
        try {
            setLoading(true);
            const response = await sendApiRequest("/balance-entry/by" + query, HTTPMethodTypes.GET);
            dispatch(entitiesActions.setEntity({ type: "balanceEntries", data: response.data }));
        }
        catch (error) {
            console.log(error);
            toastify.error("Error fetching Balance Entries");
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    const columns = useMemo(
        () => balanceEntryCols(
            onCellUpdate,
            (params: TDataGridInputCellParams) => {
                setSelectedBEntry(fetchedBalanceEntries?.find((bEntry) => bEntry._id === params.id) ?? null);
                setIsUploadDialogOpen(true)
            },
            (params: TDataGridInputCellParams) => {
                onDelete(params.id as string);
            },
            (params: TDataGridInputCellParams) => {
                onUndelete(params.id as string);
            },
        ),
        [fetchedBalanceEntries, onCellUpdate, onDelete, onUndelete]
    );

    const rows = useMemo(() => balanceEntryRows(fetchedBalanceEntries ?? []), [fetchedBalanceEntries]);

    const filteredRows = rows.filter((row) => {
        return JSON.stringify(row).toLowerCase().includes(search.toLowerCase()) &&
            (showInactive || (row as { status: string }).status !== "inactive")
    });

    useEffect(() => {
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
    }, [fromYear, toYear, months, pickedType, getBalanceEntries]);

    return {
        onSubmit,
        onUpdate,
        loading,
        columns,
        rows,
        isUploadDialogOpen,
        setIsUploadDialogOpen,
        fromYear,
        setFromYear,
        toYear,
        setToYear,
        months,
        setMonths,
        pickedType,
        setPickedType,
        fetchedBalanceEntries,
        selectedBEntry,
        setSelectedBEntry,
        setSearch,
        filteredRows,
        showInactive,
        setShowInactive,
        paginationModel,
        setPaginationModel,
        paginatedRows: paginatedRows(paginationModel, filteredRows),
        user
    };
}

export default useBalanceEntry;