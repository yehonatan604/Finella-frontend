import { useState, useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../Auth/hooks/useAuth";
import { HTTPMethodTypes } from "../../Common/types/HTTPMethodTypes";
import { THoursFromExcel } from "../types/THoursFromExcel";
import { TSalary } from "../types/TSalary";
import { TSalaryHours } from "../types/TSalaryHours";
import useWorkplaces from "./useWorkplace";
import { sendApiRequest } from "../../Common/helpers/sendApiRequest";
import { addSalaryFormDefault } from "../forms/initialData/addSalaryFormDefault";
import { toastify } from "../../Common/utilities/toast";
import { salaryCols } from "../data/salaryCols";
import { TDataGridInputCellParams } from "../types/TDataGridInputCellParams";
import { salaryRows } from "../data/salaryRows";
import { question } from "../../Common/utilities/question";
import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "../../Core/store/store";
import { entitiesActions } from "../../Core/store/entitiesSlice";
import { defaultPageSize, paginatedRows } from "../../Common/helpers/paginationHelpers";

const useSalary = (isPage?: boolean) => {
    const { user } = useAuth();
    const { workplaces, getAllWorkplaces } = useWorkplaces();

    const fetchedSalaries = useSelector((state: TRootState) => state.entitiesSlice.salaries);
    const loading = useSelector((state: TRootState) => state.entitiesSlice.loading);
    const dispatch = useDispatch();

    const [salaryHours, setSalaryHours] = useState<TSalaryHours[]>([]);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [fromYear, setFromYear] = useState(new Date().getFullYear());
    const [toYear, setToYear] = useState(new Date().getFullYear());
    const [months, setMonths] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const [pickedWorkplaces, setPickedWorkplaces] = useState<string[]>(
        workplaces
            ?.map((workplace) => workplace._id)
            .filter((id): id is string => id !== undefined) || []
    );
    const [selectedSalary, setSelectedSalary] = useState<TSalary | null>(null);
    const [isSalaryDetailsDialogOpen, setIsSalaryDetailsDialogOpen] = useState(false);
    const [search, setSearch] = useState<string>("");
    const [showInactive, setShowInactive] = useState(false);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: defaultPageSize,
    });
    const [addBEntry, setAddBEntry] = useState(true);

    const addNewSalaryHour = useCallback(() => {
        setSalaryHours((prev) => {
            return [
                ...prev,
                {
                    day: "",
                    startTime: "",
                    endTime: "",
                    breakEnd: "",
                    breakStart: "",
                    notes: "",
                },
            ];
        });
    }, []);

    const addSalaryFromExcel = useCallback((data: unknown) => {
        setSalaryHours(
            (data as THoursFromExcel[]).map((item: THoursFromExcel) => {
                return {
                    day: item["תאריך"].split("/")[0],
                    startTime: item["שעת התחלה"],
                    endTime: item["שעת סיום"],
                    breakStart: "",
                    breakEnd: "",
                    notes: "",
                };
            })
        );
    }, []);

    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors },
    } = useForm<TSalary>({
        mode: "onChange",
        defaultValues: addSalaryFormDefault(user?._id || ""),
    });

    const onSubmit = async (data: Record<string, unknown>) => {
        try {
            const finalData = {
                ...data,
                hours: salaryHours,
            };

            await sendApiRequest("/salary", HTTPMethodTypes.POST, finalData);

            if (addBEntry) {
                const balanceEntry = {
                    userId: user?._id,
                    price: calcTotalSum(finalData as TSalary),
                    date: data.date,
                    type: "income",
                    withVat: data.withVat || false,
                    isPayed: false,
                    notes: `Salary for ${data.date}`,
                };
                await sendApiRequest("/balance-entry", HTTPMethodTypes.POST, balanceEntry);
            }
            toastify.success("Salary added successfully");
        } catch (error) {
            console.log(error);
        }
    };

    const toggleUploadDialog = useCallback(() => {
        setIsUploadDialogOpen((prev) => !prev);
    }, []);

    const getSalaries = useCallback(async (query: string) => {
        try {
            dispatch(entitiesActions.setLoading(true));
            const response = await sendApiRequest("/salary/by" + query, HTTPMethodTypes.GET);
            dispatch(entitiesActions.setEntity({ type: "salaries", data: response.data }));
        }
        catch (error) {
            console.log(error);
            toastify.error("Error fetching salaries");
        }
    }, [dispatch]);

    const calcTotalHours = useCallback((hours: TSalaryHours[]) => {
        return hours.reduce((acc, curr) => {
            const startTime = new Date(`2022-01-${curr.day}T${curr.startTime}`);
            const endTime = new Date(`2022-01-${curr.day}T${curr.endTime}`);
            const diff = endTime.getTime() - startTime.getTime();
            const hours = diff / 1000 / 60 / 60;
            return acc + hours;
        }, 0);
    }, []);

    const calcTotalSum = useCallback(
        (salary: TSalary) => {
            const price =
                workplaces?.find((workplace) => workplace._id === salary.workPlaceId)
                    ?.pricePerHour || 0;
            return price * calcTotalHours(salary.hours);
        },
        [workplaces, calcTotalHours]
    );

    const onUpdate = useCallback(
        async (data: TSalary) => {
            try {
                dispatch(entitiesActions.setLoading(true));

                data.hours.forEach((hour) => {
                    delete hour._id;
                });

                await sendApiRequest(`/salary`, HTTPMethodTypes.PUT, data);

                dispatch(entitiesActions.updateEntityItem({ type: "salaries", item: data, id: data._id! }));
                toastify.success("Balance Entry updated successfully");
            } catch (error) {
                console.log(error);
                toastify.error("Error updating Balance Entry");
            }
        },
        [dispatch]
    );

    const onCellUpdate = useMemo(
        () =>
            (
                row: TSalary & {
                    id: string | undefined;
                    workplace: string | undefined;
                    year: number | undefined;
                    month: number | undefined;
                    "total hours": number | undefined;
                    "total sum": number | undefined;
                }
            ) => {
                const fetchedRow = fetchedSalaries?.find((bEntry) => bEntry._id === row.id);

                const changedFetchedRow = {
                    workplace: fetchedRow?.workPlaceId || "",
                    year: fetchedRow?.date.split("-")[1] || 0,
                    month: fetchedRow?.date.split("-")[0] || 0,
                    "total hours": calcTotalHours(fetchedRow?.hours || []),
                    "total sum": calcTotalSum(fetchedRow!) || 0,
                };

                const changedRow = {
                    workplace: workplaces?.find((workplace) => workplace.name === row.workplace)?._id || "",
                    year: row.year || 0,
                    month: row.month || 0,
                    "total hours": row["total hours"] || 0,
                    "total sum": row["total sum"] || 0,
                };

                const fields: Array<keyof typeof changedFetchedRow> = ["workplace", "year", "month", "total hours", "total sum"];
                const isEqual = fields.every((field) => changedFetchedRow[field] === changedRow[field]);

                if (isEqual) return;

                const finalRow = {
                    _id: row.id,
                    userId: user?._id,
                    workPlaceId: changedRow.workplace,
                    date: `${changedRow.month}-${changedRow.year}`,
                    hours: fetchedRow?.hours || [],
                    notes: fetchedRow?.notes || "",
                };

                onUpdate(finalRow as unknown as TSalary);
            },
        [calcTotalHours, calcTotalSum, fetchedSalaries, onUpdate, user?._id, workplaces]
    );

    const onDelete = useCallback(
        async (id: string) => {
            try {
                await question(
                    "Delete Salary",
                    "Are you sure you want to delete this Salary?",
                    "warning",
                    async () => {
                        dispatch(entitiesActions.setLoading(true));
                        await sendApiRequest(`/salary/${id}`, HTTPMethodTypes.DELETE, { userId: user?._id });
                        dispatch(entitiesActions.removeEntityItem({ type: "salaries", id }));
                        toastify.success("Salary deleted successfully");
                    }
                );
            } catch (error) {
                console.log(error);
                toastify.error("Error deleting Salary");
            }
        }, [user?._id, dispatch]);

    const onUndelete = useCallback(
        async (id: string) => {
            try {
                await question(
                    "Undelete Salary",
                    "Are you sure you want to undelete this Salary?",
                    "warning",
                    async () => {
                        dispatch(entitiesActions.setLoading(true));
                        await sendApiRequest(`/salary/undelete/${id}`, HTTPMethodTypes.PATCH, { userId: user?._id });
                        dispatch(entitiesActions.undeleteEntityItem({ type: "salaries", id }));
                        toastify.success("Salary undeleted successfully");
                    }
                );
            } catch (error) {
                console.log(error);
                toastify.error("Error undeleting Salary");
            }
        },
        [user?._id, dispatch]
    );

    const columns = useMemo(
        () => salaryCols(
            workplaces!,
            onCellUpdate,
            (params: TDataGridInputCellParams) => {
                setSelectedSalary(
                    fetchedSalaries?.find((salary) => salary._id === params.row.id) || null
                );
                setIsSalaryDetailsDialogOpen(true);
            },
            (params: TDataGridInputCellParams) => onDelete(params.row.id as string),
            (params: TDataGridInputCellParams) => onUndelete(params.row.id as string),
        ), [fetchedSalaries, onCellUpdate, workplaces, onDelete, onUndelete]
    );

    const rows = useMemo(() => salaryRows(
        fetchedSalaries ?? [],
        workplaces!,
        calcTotalHours,
        calcTotalSum
    ), [calcTotalHours, calcTotalSum, fetchedSalaries, workplaces]);

    const filteredRows = rows.filter((row) =>
        JSON.stringify(row).toLowerCase().includes(search.toLowerCase()) &&
        (showInactive || (row as { status: string }).status !== "inactive")
    );

    useEffect(() => {
        getAllWorkplaces();

        if (isPage) {
            const fetchData = async () => {
                const queryParams = new URLSearchParams();

                if (pickedWorkplaces.length > 0) {
                    queryParams.append("workplaceIds", pickedWorkplaces.join(","));
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
                await getSalaries(`?${queryString}`);
            };

            fetchData();
        }
    }, [fromYear, getAllWorkplaces, getSalaries, isPage, months, pickedWorkplaces, toYear]);

    return {
        addNewSalaryHour,
        addSalaryFromExcel,
        handleSubmit,
        register,
        setValue,
        errors,
        onSubmit,
        toggleUploadDialog,
        isUploadDialogOpen,
        salaryHours,
        workplaces,
        columns,
        rows,
        setFromYear,
        setToYear,
        setMonths,
        setPickedWorkplaces,
        loading,
        fetchedSalaries,
        onUpdate,
        selectedSalary,
        setSelectedSalary,
        isSalaryDetailsDialogOpen,
        setIsSalaryDetailsDialogOpen,
        setSearch,
        filteredRows,
        showInactive,
        setShowInactive,
        paginationModel,
        setPaginationModel,
        paginatedRows: paginatedRows(paginationModel, filteredRows),
        setAddBEntry,
        addBEntry,
    };
};

export default useSalary;