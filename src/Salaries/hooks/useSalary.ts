import { useState, useCallback, useEffect, useMemo } from "react";
import useAuth from "../../Auth/hooks/useAuth";
import { HTTPMethodTypes } from "../../Common/enums/HTTPMethodTypes";
import { THoursFromExcel } from "../../Common/types/THoursFromExcel";
import { TSalary } from "../types/TSalary";
import { TSalaryHours } from "../types/TSalaryHours";
import useWorkplaces from "../../Workplaces/hooks/useWorkplace";
import { sendApiRequest } from "../../Common/helpers/sendApiRequest";
import { toastify } from "../../Common/utilities/toast";
import { salaryCols } from "../data/salaryCols";
import { TDataGridInputCellParams } from "../../Common/types/TDataGridInputCellParams";
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
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [salaryHours, setSalaryHours] = useState<TSalaryHours[]>([]);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [fromYear, setFromYear] = useState(new Date().getFullYear());
    const [toYear, setToYear] = useState(new Date().getFullYear());
    const [months, setMonths] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const [selectedSalary, setSelectedSalary] = useState<TSalary | null>(null);
    const [search, setSearch] = useState<string>("");
    const [showInactive, setShowInactive] = useState(false);
    const [addBEntry, setAddBEntry] = useState(true);
    const [pickedWorkplaces, setPickedWorkplaces] = useState<string[]>(
        workplaces
            ?.map((workplace) => workplace._id)
            .filter((id): id is string => id !== undefined) || []
    );
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: defaultPageSize,
    });

    const addNewSalaryHour = useCallback(() => {
        setSalaryHours((prev) => {
            return [
                ...prev,
                {
                    day: "",
                    startTime: "",
                    endTime: "",
                    notes: "",
                },
            ];
        });
    }, []);

    const removeSalaryHour = useCallback((index: number) => {
        setSalaryHours((prev) => {
            const newSalaryHours = [...prev];
            newSalaryHours.splice(index, 1);
            return newSalaryHours;
        });
    }, []);

    const addSalaryFromExcel = useCallback((data: unknown) => {
        console.log(data);

        setSalaryHours(
            (data as THoursFromExcel[]).map((item: THoursFromExcel) => {
                return {
                    day: item["תאריך"].split("/")[0],
                    startTime: item["שעת התחלה"],
                    endTime: item["שעת סיום"],
                    notes: "",
                };
            })
        );
    }, []);

    const onSubmit = async (data: Record<string, unknown>) => {
        try {
            setLoading(true);
            const newSalary = await sendApiRequest("/salary", HTTPMethodTypes.POST, data);
            dispatch(entitiesActions.addEntityItem({ type: "salaries", item: newSalary.data }));
            if (addBEntry) {
                const workplaceName = workplaces?.find(
                    (workplace) => workplace._id === data.workPlaceId
                )?.name;

                const fullDate = (() => {
                    const [month, year] = (data.date as string).split("-").map(Number);
                    const today = new Date();
                    return new Date(year, month - 1, today.getDate());
                })();

                const balanceEntry = {
                    name: `Salary ${data.date} - ${workplaces?.find((workplace) => workplace._id === data.workPlaceId)?.name}`,
                    userId: user?._id,
                    price: calcTotalSum(data as TSalary),
                    date: fullDate,
                    type: "income",
                    notes: `Salary ${data.date} - ${workplaceName}`,
                };
                const newBentry = await sendApiRequest("/balance-entry", HTTPMethodTypes.POST, balanceEntry);
                dispatch(entitiesActions.addEntityItem({ type: "balanceEntries", item: newBentry.data }));
                toastify.success("Balance Entry added successfully");
            }
            toastify.success("Salary added successfully");
        } catch (error) {
            console.log(error);
            toastify.error("Error adding Salary");
        } finally {
            setLoading(false);
            setSelectedSalary(null);
            setSalaryHours([]);
        }
    };

    const toggleUploadDialog = useCallback(() => {
        setIsUploadDialogOpen((prev) => !prev);
    }, []);

    const getSalaries = useCallback(async (query: string) => {
        try {
            setLoading(true);
            const response = await sendApiRequest("/salary/by" + query, HTTPMethodTypes.GET);
            dispatch(entitiesActions.setEntity({ type: "salaries", data: response.data }));
        }
        catch (error) {
            console.log(error);
            toastify.error("Error fetching salaries");
        } finally {
            setLoading(false);
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
                setLoading(true);

                data.hours.forEach((hour) => {
                    delete hour._id;
                });

                await sendApiRequest(`/salary`, HTTPMethodTypes.PUT, data);

                dispatch(entitiesActions.updateEntityItem({ type: "salaries", item: data, id: data._id! }));
                toastify.success("Balance Entry updated successfully");
            } catch (error) {
                console.log(error);
                toastify.error("Error updating Balance Entry");
            } finally {
                setLoading(false);
                setSelectedSalary(null);
                setSalaryHours([]);
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
                setLoading(true);
                await question(
                    "Delete Salary",
                    "Are you sure you want to delete this Salary?",
                    "warning",
                    async () => {
                        setLoading(true);
                        await sendApiRequest(`/salary/${id}`, HTTPMethodTypes.DELETE, { userId: user?._id });
                        dispatch(entitiesActions.removeEntityItem({ type: "salaries", id }));
                        toastify.success("Salary deleted successfully");
                    }
                );
            } catch (error) {
                console.log(error);
                toastify.error("Error deleting Salary");
            } finally {
                setLoading(false);
                setSelectedSalary(null);
                setSalaryHours([]);
            }
        }, [user?._id, dispatch]);

    const onUndelete = useCallback(
        async (id: string) => {
            try {
                setLoading(true);
                await question(
                    "Undelete Salary",
                    "Are you sure you want to undelete this Salary?",
                    "warning",
                    async () => {
                        setLoading(true);
                        await sendApiRequest(`/salary/undelete/${id}`, HTTPMethodTypes.PATCH, { userId: user?._id });
                        dispatch(entitiesActions.undeleteEntityItem({ type: "salaries", id }));
                        toastify.success("Salary undeleted successfully");
                    }
                );
            } catch (error) {
                console.log(error);
                toastify.error("Error undeleting Salary");
            } finally {
                setLoading(false);
                setSelectedSalary(null);
                setSalaryHours([]);
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
                setIsUploadDialogOpen(true);
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
        removeSalaryHour,
        addSalaryFromExcel,
        onSubmit,
        toggleUploadDialog,
        isUploadDialogOpen,
        setIsUploadDialogOpen,
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
        setSearch,
        filteredRows,
        showInactive,
        setShowInactive,
        paginationModel,
        setPaginationModel,
        paginatedRows: paginatedRows(paginationModel, filteredRows),
        setAddBEntry,
        addBEntry,
        user
    };
};

export default useSalary;