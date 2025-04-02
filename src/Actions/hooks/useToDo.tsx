import { useForm } from "react-hook-form";
import { HTTPMethodTypes } from "../../Core/types/HTTPMethodTypes";
import { useCallback, useEffect, useMemo, useState } from "react";
import useAuth from "../../Auth/hooks/useAuth";
import { sendApiRequest } from "../../Core/helpers/sendApiRequest";
import { addToDoFormDefault } from "../forms/initialData/addToDoFormDefault";
import { TToDo } from "../types/TToDo";
import { toastify } from "../../UI/utilities/toast";
import { TDataGridInputCellParams } from "../types/TDataGridInputCellParams";
import { formatDate } from "../../Core/helpers/dateHelpers";
import { todoCols } from "../data/todoCols";
import { todoRows } from "../data/todoRows";
import { question } from "../../UI/utilities/question";

const useToDo = (isTodoPage: boolean = false) => {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchedToDos, setFetchedTodos] = useState<TToDo[]>([]);
  const [fromYear, setFromYear] = useState(new Date().getFullYear());
  const [toYear, setToYear] = useState(new Date().getFullYear());
  const [months, setMonths] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const [pickedStatus, setPickedStatus] = useState<string>("all");
  const [isToDoDetailsDialogOpen, setIsToDoDetailsDialogOpen] = useState(false);
  const [selectedToDo, setSelectedToDo] = useState<TToDo | null>(null);
  const [search, setSearch] = useState<string>("");
  const [showInactive, setShowInactive] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<TToDo>({
    mode: "onChange",
    defaultValues: addToDoFormDefault,
  });

  const getToDos = useCallback(async (query: string) => {
    try {
      const response = await sendApiRequest("/todo/by" + query, HTTPMethodTypes.GET);
      setFetchedTodos(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const onUpdate = useCallback(
    async (data: TToDo) => {
      try {
        setLoading(true);
        setError(null);
        await sendApiRequest(`/todo`, HTTPMethodTypes.PUT, {
          ...data,
          userId: user?._id,
        });
        setFetchedTodos((prev) =>
          prev.map((todo) => (todo._id === data._id ? data : todo))
        );
        toastify.success("ToDo updated successfully");
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
    },
    [user?._id]
  );

  const onCellUpdate = useMemo(
    () =>
      (
        row: TToDo & {
          id: string | undefined;
        }
      ) => {
        const fetchedRow = fetchedToDos.find((toDo) => toDo._id === row.id);

        const fields = [
          "name",
          "description",
          "startDate",
          "endDate",
          "toDoStatus",
        ] as const;

        const normalizeRow = (row: Partial<TToDo>) => ({
          name: row?.name,
          description: row?.description,
          startDate: formatDate(row?.startDate),
          endDate: formatDate(row?.endDate),
          toDoStatus: row?.toDoStatus,
        });

        const checkFetchedRow = normalizeRow(fetchedRow as TToDo);
        const checkRow = normalizeRow(row);

        const isEqual = fields.every(
          (field) => checkFetchedRow[field] === checkRow[field]
        );

        if (isEqual) return;

        const finalRow = {
          _id: row.id,
          userId: fetchedRow?.userId,
          tasks: fetchedRow?.tasks,
          name: row.name ?? fetchedRow?.name ?? "",
          description: row?.description ?? fetchedRow?.description ?? "",
          startDate: new Date(
            (row.startDate ?? fetchedRow?.startDate ?? "").split("/").reverse().join("-")
          ),
          endDate: new Date(
            (row.endDate ?? fetchedRow?.endDate ?? "").split("/").reverse().join("-")
          ),
          toDoStatus: row.toDoStatus ?? fetchedRow?.toDoStatus ?? "PENDING",
          notes: row.notes ?? fetchedRow?.notes ?? "",
        };
        onUpdate(finalRow as unknown as TToDo);
      },
    [fetchedToDos, onUpdate]
  );

  const onUndelete = useCallback(
    async (id: string) => {
      try {
        await question(
          "Undelete Todo",
          "Are you sure you want to undelete this Todo?",
          "warning",
          async () => {
            setLoading(true);
            setError(null);
            await sendApiRequest(`/todo/undelete/${id}`, HTTPMethodTypes.PATCH, {
              userId: user?._id,
            });
            setFetchedTodos((prev) => {
              const todo = prev.find((td) => td._id === id);
              if (!todo) return prev;
              const fixedTodo = {
                ...todo,
                status: "active",
              };
              return prev.map((td) => (td._id === id ? fixedTodo : td));
            });
            toastify.success("ToDo undeleted successfully");
          }
        );
      } catch (error) {
        console.log(error);
        toastify.error("Error undeleting ToDo");

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

  const onDelete = useCallback(
    async (id: string) => {
      try {
        await question(
          "Delete ToDo",
          "Are you sure you want to delete this ToDo?",
          "warning",
          async () => {
            setLoading(true);
            setError(null);
            await sendApiRequest(`/todo/${id}`, HTTPMethodTypes.DELETE, {
              userId: user?._id,
            });
            setFetchedTodos((prev) => {
              const todo = prev.find((td) => td._id === id);
              if (!todo) return prev;
              const fixedTodo = {
                ...todo,
                status: "inactive",
              };
              return prev.map((td) => (td._id === id ? fixedTodo : td));
            });
            toastify.success("ToDo deleted successfully");
          }
        );
      } catch (error) {
        console.log(error);
        toastify.error("Error deleting Salary");

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

  const onSubmit = async (data: TToDo) => {
    try {
      setLoading(true);
      setError(null);
      if (data.tasks?.[0]?.name === "") {
        delete data.tasks;
      }
      await sendApiRequest(`/todo`, HTTPMethodTypes.POST, { ...data, userId: user?._id });
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

  const columns = useMemo(
    () =>
      todoCols(
        onCellUpdate,
        (params: TDataGridInputCellParams) => {
          setSelectedToDo(fetchedToDos.find((todo) => todo._id === params.id) ?? null);
          setIsToDoDetailsDialogOpen(true);
        },
        (params: TDataGridInputCellParams) => {
          onDelete(params.id as string);
        },
        (params: TDataGridInputCellParams) => onUndelete(params.row.id as string)
      ),
    [onCellUpdate, fetchedToDos, onDelete, onUndelete]
  );

  const rows = useMemo(() => todoRows(fetchedToDos), [fetchedToDos]);

  const filteredRows = rows.filter(
    (row) =>
      JSON.stringify(row).toLowerCase().includes(search.toLowerCase()) &&
      (showInactive || (row as { status: string }).status !== "inactive")
  );

  useEffect(() => {
    if (!isTodoPage) return;
    const fetchData = async () => {
      const queryParams = new URLSearchParams();

      if (pickedStatus) {
        queryParams.append("toDoStatus", pickedStatus === "all" ? "" : pickedStatus);
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
      await getToDos(`?${queryString}`);
    };

    fetchData();
  }, [fromYear, toYear, months, pickedStatus, isTodoPage, getToDos]);

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
    pickedStatus,
    setPickedStatus,
    fetchedToDos,
    processRowOnCellUpdate: onCellUpdate,
    isToDoDetailsDialogOpen,
    setIsToDoDetailsDialogOpen,
    selectedToDo,
    setSelectedToDo,
    setSearch,
    filteredRows,
    showInactive,
    setShowInactive,
  };
};

export default useToDo;
