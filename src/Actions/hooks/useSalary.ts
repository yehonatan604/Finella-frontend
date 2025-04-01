import { useState, useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../Auth/hooks/useAuth";
import { HTTPMethodTypes } from "../../Core/types/HTTPMethodTypes";
import { THoursFromExcel } from "../types/THoursFromExcel";
import { TSalary } from "../types/TSalary";
import { TSalaryHours } from "../types/TSalaryHours";
import useWorkplaces from "./useWorkplace";
import { sendApiRequest } from "../../Core/helpers/sendApiRequest";
import { addSalaryFormDefault } from "../forms/initialData/addSalaryFormDefault";
import { toastify } from "../../UI/utilities/toast";
import { salaryCols } from "../data/salaryCols";
import { TDataGridInputCellParams } from "../types/TDataGridInputCellParams";
import { salaryRows } from "../data/salaryRows";

const useSalary = (isSalariesPage: boolean = false) => {
    const { user } = useAuth();
    const { workplaces, getAllWorkplaces } = useWorkplaces();
    const [salaryHours, setSalaryHours] = useState<TSalaryHours[]>([]);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [fetchedSalaries, setFetchedSalaries] = useState<TSalary[]>([]);
    const [fromYear, setFromYear] = useState(new Date().getFullYear());
    const [toYear, setToYear] = useState(new Date().getFullYear());
    const [months, setMonths] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const [pickedWorkplaces, setPickedWorkplaces] = useState<string[]>(
        workplaces
            ?.map((workplace) => workplace._id)
            .filter((id): id is string => id !== undefined) || []
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedSalary, setSelectedSalary] = useState<TSalary | null>(null);
    const [isSalaryDetailsDialogOpen, setIsSalaryDetailsDialogOpen] = useState(false);

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
                setError(null);

                data.hours.forEach((hour) => {
                    delete hour._id;
                });

                await sendApiRequest(`/salary`, HTTPMethodTypes.PUT, data);

                setFetchedSalaries((prev) =>
                    prev.map((entry) => {
                        if (entry._id === data._id) {
                            return {
                                ...entry,
                                ...data,
                            };
                        }
                        return entry;
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
        []
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
                const fetchedRow = fetchedSalaries.find((bEntry) => bEntry._id === row.id);

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
                setError(null);

                await sendApiRequest(`/salary/${id}`, HTTPMethodTypes.DELETE);

                setFetchedSalaries((prev) => prev.filter((entry) => entry._id !== id));
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
        }, []
    );

    const columns = useMemo(
        () => salaryCols(
            workplaces!,
            onCellUpdate,
            (params: TDataGridInputCellParams) => {
                setSelectedSalary(
                    fetchedSalaries.find((salary) => salary._id === params.row.id) || null
                );
                setIsSalaryDetailsDialogOpen(true);
            },
            (params: TDataGridInputCellParams) => onDelete(params.row.id as string)
        ), [fetchedSalaries, onCellUpdate, workplaces, onDelete]
    );

    const rows = useMemo(() => salaryRows(
        fetchedSalaries,
        workplaces!,
        calcTotalHours,
        calcTotalSum
    ), [calcTotalHours, calcTotalSum, fetchedSalaries, workplaces]);

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
        //resolver: joiResolver(addWorkplaceSchema),
    });

    const onSubmit = async (data: Record<string, unknown>) => {
        try {
            const finalData = {
                ...data,
                hours: salaryHours,
            };

            await sendApiRequest("/salary", HTTPMethodTypes.POST, finalData);
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
            const response = await sendApiRequest("/salary/by" + query, HTTPMethodTypes.GET);
            setFetchedSalaries(response.data);
        }
        catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        getAllWorkplaces();

        if (isSalariesPage) {
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
    }, [fromYear, getAllWorkplaces, getSalaries, isSalariesPage, months, pickedWorkplaces, toYear]);

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
        error,
        loading,
        fetchedSalaries,
        onUpdate,
        selectedSalary,
        setSelectedSalary,
        isSalaryDetailsDialogOpen,
        setIsSalaryDetailsDialogOpen,
    };
};

export default useSalary;