import { useForm } from "react-hook-form";
import { HTTPMethodTypes } from "../../Core/types/HTTPMethodTypes";
import { useCallback, useEffect, useMemo, useState } from "react";
import useAuth from "../../Auth/hooks/useAuth";
import { sendApiRequest } from "../../Core/helpers/sendApiRequest";
import { addToDoFormDefault } from "../forms/initialData/addToDoFormDefault";
import { TToDo } from "../types/TToDo";
import { toastify } from "../../UI/utilities/toast";

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

  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Name",
        flex: 1,
        headerClassName: "super-app-theme--header",
        editable: true,
      },
      {
        field: "description",
        headerName: "Description",
        flex: 1,
        headerClassName: "super-app-theme--header",
        editable: true,
      },
      {
        field: "startDate",
        headerName: "Start Date",
        flex: 1,
        headerClassName: "super-app-theme--header",
        editable: true,
      },
      {
        field: "endDate",
        headerName: "End Date",
        flex: 1,
        headerClassName: "super-app-theme--header",
        editable: true,
      },
      {
        field: "toDoStatus",
        headerName: "Status",
        flex: 1,
        headerClassName: "super-app-theme--header",
        editable: true,
      },
      {
        field: "tasks",
        headerName: "Tasks",
        flex: 1,
        headerClassName: "super-app-theme--header",
        editable: false,
      },
    ],
    []
  );

  const formatDate = (value?: string | Date) => {
    if (!value) return "";
    const date = typeof value === "string" ? new Date(value) : value;
    return date.toISOString().split("T")[0].split("-").reverse().join("/");
  };

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

  const onUpdate = async (data: TToDo) => {
    try {
      setLoading(true);
      setError(null);
      await sendApiRequest(`/todo`, HTTPMethodTypes.PUT, { ...data, userId: user?._id });
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
  };

  const getToDos = useCallback(async (query: string) => {
    try {
      const response = await sendApiRequest("/todo/by" + query, HTTPMethodTypes.GET);
      setFetchedTodos(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const processRowOnCellUpdate = (row: {
    id: string | undefined;
    name: string;
    startDate: string;
    endDate: string;
  }) => {
    const fetchedRow = fetchedToDos.find((toDo) => toDo._id === row.id);
    const finalRow = {
      _id: row.id,
      name: row.name,
      description: fetchedRow?.description ?? "",
      startDate: new Date(row.startDate.split("/").reverse().join("-")),
      endDate: new Date(row.endDate.split("/").reverse().join("-")),
      tasks: fetchedRow?.tasks,
      toDoStatus:
        fetchedRow?.toDoStatus ?? "PENDING",
      userId: fetchedRow?.userId ?? "",
      notes: fetchedRow?.notes ?? "",
    };
    onUpdate(finalRow as unknown as TToDo);
  };

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
    processRowOnCellUpdate,
  };
};

export default useToDo;
