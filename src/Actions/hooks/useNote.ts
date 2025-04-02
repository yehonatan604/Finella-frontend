import { useCallback, useEffect, useMemo, useState } from "react";
import { HTTPMethodTypes } from "../../Core/types/HTTPMethodTypes";
import { sendApiRequest } from "../../Core/helpers/sendApiRequest";
import { TDataGridInputCellParams } from "../types/TDataGridInputCellParams";
import { toastify } from "../../UI/utilities/toast";
import { question } from "../../UI/utilities/question";
import { TNote } from "../types/TNote";
import { noteCols } from "../data/noteCols";
import { noteRows } from "../data/noteRows";
import useAuth from "../../Auth/hooks/useAuth";

const useNote = () => {
    const [fetchedNotes, setFetchedNotes] = useState<TNote[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState<TNote | null>(null);
    const [search, setSearch] = useState<string>("");
    const [showInactive, setShowInactive] = useState(false);
    const { user } = useAuth()

    const getAllNotes = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const res = await sendApiRequest("/note", HTTPMethodTypes.GET);
            setFetchedNotes(res.data);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError(String(e));
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const add = useCallback(async (note: TNote) => {
        try {
            setLoading(true);
            setError("");
            const res = await sendApiRequest("/note", HTTPMethodTypes.POST, { ...note, userId: user?._id });
            setFetchedNotes(prev => [...(prev || []), res.data]);
            toastify.success("Note added successfully");
        } catch (e) {
            console.log(e);
            toastify.error("Error adding Note");

            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError(String(e));
            }
        } finally {
            setLoading(false);
        }
    }, [user?._id]);

    const onUpdate = useCallback(async (note: TNote) => {
        try {
            setLoading(true);
            setError("");

            const finalNote = {
                _id: note._id ?? (note as TNote & { id: string })["id"],
                userId: user?._id,
                name: note.name,
                content: note.content,
                date: note.date,
                isSticky: note.isSticky,
                notes: note.notes,
            };

            const res = await sendApiRequest(`/note`, HTTPMethodTypes.PUT, finalNote);

            setFetchedNotes(prev =>
                (prev ?? []).map(n => (n?._id === res.data._id ? res.data : n))
            );

            setSelectedNote(null);
            toastify.success("Note updated successfully");
        } catch (e) {
            console.error(e);
            toastify.error("Error updating Note");
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setLoading(false);
        }
    }, [user?._id]);


    const onCellUpdate = useMemo(
        () => (row: TNote & { id: string | undefined }) => {
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
                onUpdate(row as unknown as TNote);
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
                        setLoading(true);
                        setError(null);
                        await sendApiRequest(`/note/undelete/${id}`, HTTPMethodTypes.PATCH);
                        setFetchedNotes((prev) => {
                            const note = prev?.find((n) => n._id === id);
                            if (!note) return prev;
                            const fixedWorkNote = {
                                ...note,
                                status: "active",
                            };
                            return prev?.map((n) => (n._id === id ? fixedWorkNote : n));
                        });
                        toastify.success("Note undeleted successfully");
                    }
                );
            } catch (error) {
                console.log(error);
                toastify.error("Error undeleting Note");

                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError(error as string);
                }
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const onDelete = useCallback(
        async (id: string) => {
            try {
                await question(
                    "Delete Note",
                    "Are you sure you want to delete this Note?",
                    "warning",
                    async () => {
                        setLoading(true);
                        setError(null);
                        await sendApiRequest(`/note/${id}`, HTTPMethodTypes.DELETE);
                        setFetchedNotes((prev) => {
                            const note = prev?.find((n) => n._id === id);
                            if (!note) return prev;
                            const fixedNote = {
                                ...note,
                                status: "inactive",
                            };
                            return prev?.map((n) => (n._id === id ? fixedNote : n));
                        });
                        toastify.success("Note deleted successfully");
                    }
                );
            } catch (error) {
                console.log(error);
                toastify.error("Error deleting Note");

                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError(error as string);
                }
            } finally {
                setLoading(false);
            }
        },
        []
    );

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

    const filteredRows = rows.filter((row) =>
        JSON.stringify(row).toLowerCase().includes(search.toLowerCase()) &&
        (showInactive || (row as { status: string }).status !== "inactive")
    );

    useEffect(() => {
        getAllNotes();
    }, [getAllNotes]);

    return {
        fetchedNotes,
        columns,
        rows,
        getAllNotes,
        add,
        error,
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
    }
}

export default useNote;