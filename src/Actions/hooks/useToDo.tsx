import { useForm } from "react-hook-form";
import { HTTPMethodTypes } from "../../Core/types/HTTPMethodTypes";
import { useCallback, useEffect, useMemo, useState } from "react";
import useAuth from "../../Auth/hooks/useAuth";
import { sendApiRequest } from "../../Core/helpers/sendApiRequest";
import { addToDoFormDefault } from "../forms/initialData/addToDoFormDefault";
import { TToDo } from "../types/TToDo";
import { toastify } from "../../UI/utilities/toast";
import { createDataGridInputCell } from "../components/createDataGridInputCell";
import { TDataGridInputCellParams } from "../types/TDataGridInputCellParams";
import { formatDate } from "../../Core/helpers/dateHelpers";

const useToDo = (isTodoPage: boolean = false) => {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchedToDos, setFetchedTodos] = useState<TToDo[]>([]);
  const [fromYear, setFromYear] = useState(new Date().getFullYear());
  const [toYear, setToYear] = useState(new Date().getFullYear());
  const [months, setMonths] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const [pickedStatus, setPickedStatus] = useState<string>("all");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<TToDo>({
    mode: "onChange",
    defaultValues: addToDoFormDefault,
  });

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

        const checkFetchedRow = {
          name: fetchedRow?.name,
          description: fetchedRow?.description,
          startDate: formatDate(fetchedRow?.startDate),
          endDate: formatDate(fetchedRow?.endDate),
          toDoStatus: fetchedRow?.toDoStatus,
        };

        const checkRow = {
          name: row.name,
          description: row.description,
          startDate: row.startDate,
          endDate: row.endDate,
          toDoStatus: row.toDoStatus,
        };

        const isEqual = Object.keys(checkFetchedRow).every(
          (key) =>
            checkFetchedRow[key as keyof typeof checkFetchedRow] ===
            checkRow[key as keyof typeof checkRow]
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

  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Name",
        flex: 1,
        headerClassName: "super-app-theme--header",
        editable: true,
        renderCell: (params: TDataGridInputCellParams) => {
          return createDataGridInputCell(params, onCellUpdate, "name");
        },
      },
      {
        field: "description",
        headerName: "Description",
        flex: 1,
        headerClassName: "super-app-theme--header",
        editable: true,
        renderCell: (params: TDataGridInputCellParams) => {
          return createDataGridInputCell(params, onCellUpdate, "description");
        },
      },
      {
        field: "startDate",
        headerName: "Start Date",
        flex: 1,
        headerClassName: "super-app-theme--header",
        editable: true,
        renderCell: (params: TDataGridInputCellParams) => {
          return createDataGridInputCell(params, onCellUpdate, "startDate", "date");
        },
      },
      {
        field: "endDate",
        headerName: "End Date",
        flex: 1,
        headerClassName: "super-app-theme--header",
        editable: true,
        renderCell: (params: TDataGridInputCellParams) => {
          return createDataGridInputCell(params, onCellUpdate, "endDate", "date");
        },
      },
      {
        field: "toDoStatus",
        headerName: "Status",
        flex: 1,
        headerClassName: "super-app-theme--header",
        editable: true,
        renderCell: (params: TDataGridInputCellParams) => {
          return createDataGridInputCell(params, onCellUpdate, "toDoStatus", "select", [
            "PENDING",
            "COMPLETED",
          ]);
        },
      },
      {
        field: "tasks",
        headerName: "Tasks",
        flex: 1,
        headerClassName: "super-app-theme--header",
        editable: false,
      },
    ],
    [onCellUpdate]
  );

  const rows = useMemo(() => {
    return (
      fetchedToDos.map((todo) => ({
        id: todo._id,
        name: todo.name,
        description: todo.description,
        startDate: formatDate(todo.startDate),
        endDate: formatDate(todo.endDate),
        toDoStatus: todo.toDoStatus,
        tasks: todo.tasks?.length,
      })) || []
    );
  }, [fetchedToDos]);

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

  const getToDos = useCallback(async (query: string) => {
    try {
      const response = await sendApiRequest("/todo/by" + query, HTTPMethodTypes.GET);
      setFetchedTodos(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

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
  };
};

export default useToDo;
