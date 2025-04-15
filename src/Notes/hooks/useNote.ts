import { useCallback, useEffect, useMemo, useState } from "react";
import { HTTPMethodTypes } from "../../Common/types/HTTPMethodTypes";
import { sendApiRequest } from "../../Common/helpers/sendApiRequest";
import { toastify } from "../../Common/utilities/toast";
import { question } from "../../Common/utilities/question";
import { TNote } from "../types/TNote";
import { noteCols } from "../data/noteCols";
import { noteRows } from "../data/noteRows";
import useAuth from "../../Auth/hooks/useAuth";
import { formatStringDate } from "../../Common/helpers/dateHelpers";
import { useForm } from "react-hook-form";
import { addNoteFormDefault } from "../forms/initialData/addNoteFormDefault";
import { TDataGridInputCellParams } from "../../Actions/types/TDataGridInputCellParams";
import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "../../Common/store/store";
import { entitiesActions } from "../../Common/store/entitiesSlice";
import { defaultPageSize } from "../../Common/helpers/pageSizeOptions";

const useNote = () => {
    const { user } = useAuth();

    const fetchedNotes = useSelector((state: TRootState) => state.entitiesSlice.notes);
    const loading = useSelector((state: TRootState) => state.entitiesSlice.loading);
    const dispatch = useDispatch();

    const [lastFetchedQuery, setLastFetchedQuery] = useState<string | null>(null);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState<TNote | null>(null);
    const [search, setSearch] = useState<string>("");
    const [showInactive, setShowInactive] = useState(false);
    const [fromYear, setFromYear] = useState(new Date().getFullYear());
    const [toYear, setToYear] = useState(new Date().getFullYear());
    const [months, setMonths] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: defaultPageSize,
    });

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<TNote>({
        mode: "onChange",
        defaultValues: addNoteFormDefault,
    });

    const getAllNotes = useCallback(async (query: string) => {
        try {
            dispatch(entitiesActions.setLoading(true));
            const response = await sendApiRequest("/note/by" + query, HTTPMethodTypes.GET);
            dispatch(entitiesActions.setEntity({ type: "notes", data: response.data }));
        }
        catch (e) {
            console.error(e);
            toastify.error("Error updating Note");
        }
    }, [dispatch]);

    const onSubmit = useCallback(async (note: TNote) => {
        try {
            dispatch(entitiesActions.setLoading(true));
            const res = await sendApiRequest("/note", HTTPMethodTypes.POST, { ...note, userId: user?._id });
            dispatch(entitiesActions.addEntityItem({ type: "notes", item: res.data }));
            setSelectedNote(null);
            toastify.success("Note added successfully");
        } catch (e) {
            console.error(e);
            toastify.error("Error updating Note");
        }
    }, [dispatch, user?._id]);

    const onUpdate = useCallback(async (note: TNote) => {
        try {
            dispatch(entitiesActions.setLoading(true));

            const finalNote = {
                _id: note._id ?? (note as TNote & { id: string })["id"],
                userId: user?._id,
                name: note.name,
                content: note.content,
                date: new Date(formatStringDate(note.date)),
                isSticky: note.isSticky,
                notes: note.notes,
            };

            const res = await sendApiRequest(`/note`, HTTPMethodTypes.PUT, finalNote);
            dispatch(entitiesActions.updateEntityItem({ type: "notes", item: res.data, id: res.data._id }));
            setSelectedNote(null);
            toastify.success("Note updated successfully");
        } catch (e) {
            console.error(e);
            toastify.error("Error updating Note");
        }
    }, [user?._id, dispatch]);


    const onCellUpdate = useMemo(
        () => async (row: TNote & { id: string | undefined }) => {
            const fetchedRow = fetchedNotes?.find(workplace => workplace._id === row.id);

            const fields = [
                "name",
                "content",
                "date",
                "isSticky",
                "notes",
            ] as const;

            const normalizeRow = (row: Partial<TNote>) => ({
                _id: row._id || "",
                userId: row.userId || "",
                name: row.name || "",
                content: row.content || "",
                date: row.date || "",
                isSticky: row.isSticky || false,
                notes: row.notes || "",
            });

            const checkFetchedRow = normalizeRow(fetchedRow as TNote);
            const checkRow = normalizeRow(row);

            const isEqual = fields.every(
                field => checkFetchedRow[field] === checkRow[field]
            );

            if (!isEqual) {
                await onUpdate(row as unknown as TNote);
            }
        },
        [onUpdate, fetchedNotes]
    );

    const onUndelete = useCallback(
        async (id: string) => {
            try {
                await question(
                    "Undelete Note",
                    "Are you sure you want to undelete this Note?",
                    "warning",
                    async () => {
                        dispatch(entitiesActions.setLoading(true));
                        await sendApiRequest(`/note/undelete/${id}`, HTTPMethodTypes.PATCH);
                        dispatch(entitiesActions.undeleteEntityItem({ type: "notes", id }));
                        toastify.success("Note undeleted successfully");
                    }
                );
            } catch (e) {
                toastify.error("Error undeleting Note");
                console.error(e);
            }
        },
        [dispatch]
    );

    const onDelete = useCallback(
        async (id: string) => {
            try {
                await question(
                    "Delete Note",
                    "Are you sure you want to delete this Note?",
                    "warning",
                    async () => {
                        dispatch(entitiesActions.setLoading(true));
                        await sendApiRequest(`/note/${id}`, HTTPMethodTypes.DELETE);
                        dispatch(entitiesActions.removeEntityItem({ type: "notes", id }));
                        setSelectedNote(null);
                        toastify.success("Note deleted successfully");
                    }
                );
            } catch (e) {
                toastify.error("Error deleting Note");
                console.error(e);
            }
        },
        [dispatch]
    );

    const fetchData = useCallback(async () => {
        const queryParams = new URLSearchParams();

        if (fromYear) queryParams.append("fromYear", fromYear.toString());
        if (toYear) queryParams.append("toYear", toYear.toString());
        if (months.length > 0 && months.length < 12) {
            queryParams.append("months", months.join(","));
        }

        const queryString = queryParams.toString();

        if (queryString === lastFetchedQuery && fetchedNotes) return;

        await getAllNotes(`?${queryString}`);
        setLastFetchedQuery(queryString);
    }, [fromYear, toYear, months, lastFetchedQuery, fetchedNotes, getAllNotes]);

    const columns = useMemo(
        () => noteCols(
            onCellUpdate,
            (params: TDataGridInputCellParams) => {
                setSelectedNote(fetchedNotes?.find(workplace => workplace._id === params.id) ?? null);
                setIsUpdateDialogOpen(true);
            }
            , (params: TDataGridInputCellParams) => {
                onDelete(params.id as string);
            }
            , (params: TDataGridInputCellParams) => {
                onUndelete(params.id as string);
            }

        ), [onCellUpdate, onDelete, onUndelete, fetchedNotes]
    );

    const rows = useMemo(() => noteRows(fetchedNotes || []), [fetchedNotes]);

    const filteredRows = useMemo(() => rows.filter((row) =>
        JSON.stringify(row).toLowerCase().includes(search.toLowerCase()) &&
        (showInactive || (row as { status: string }).status !== "inactive")
    ), [rows, search, showInactive]);

    const paginatedRows = useMemo(() => {
        const start = paginationModel.page * paginationModel.pageSize;
        const end = start + paginationModel.pageSize;
        return filteredRows.slice(start, end);
    }, [filteredRows, paginationModel]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        columns,
        rows,
        onSubmit,
        loading,
        isUpdateDialogOpen,
        setIsUpdateDialogOpen,
        selectedNote,
        setSelectedNote,
        onUpdate,
        setSearch,
        filteredRows,
        setShowInactive,
        showInactive,
        handleSubmit,
        register,
        errors,
        setMonths,
        setFromYear,
        setToYear,
        isAddDialogOpen,
        setIsAddDialogOpen,
        fetchedNotes,
        paginationModel,
        setPaginationModel,
        paginatedRows,
    }
}

export default useNote;