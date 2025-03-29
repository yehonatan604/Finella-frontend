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

    const columns = useMemo(
        () => [
            {
                field: "workplace",
                headerName: "Workplace",
                flex: 1,
                headerClassName: "super-app-theme--header",
                sortable: true,
                sortComparator: (v1: string, v2: string, param1: { id: string; }, param2: { id: string; }) => {
                    if (param1.id === "total" || param2.id === "total") return;
                    return v1.localeCompare(v2);
                },
            },
            {
                field: "year",
                headerName: "Year",
                flex: 1,
                headerClassName: "super-app-theme--header",
                sortable: true,
                sortComparator: (v1: number, v2: number) => v1 - v2,
            },
            {
                field: "month",
                headerName: "Month",
                flex: 1,
                headerClassName: "super-app-theme--header",
                sortable: true,
                sortComparator: (v1: number, v2: number) => v1 - v2,
            },
            {
                field: "total hours",
                headerName: "Total Hours",
                flex: 1,
                headerClassName: "super-app-theme--header",
                sortable: true,
                sortComparator: (v1: number, v2: number, param1, param2) => {
                    if (param1.id === "total" || param2.id === "total") return;
                    return v1 - v2;
                },
            },
            {
                field: "total sum",
                headerName: "Total Sum",
                flex: 1,
                headerClassName: "super-app-theme--header",
                sortable: true,
                sortComparator: (v1: number, v2: number, param1, param2) => {
                    if (param1.id === "total" || param2.id === "total") return;
                    return v1 - v2;
                },
            },
        ],
        []
    );


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

    const rows = useMemo(() => {
        const data =
            fetchedSalaries.map((salary) => ({
                id: salary._id,
                workplace:
                    workplaces?.find((workplace) => workplace._id === salary.workPlaceId)?.name ||
                    "",
                year: salary.date.split("-")[1],
                month: salary.date.split("-")[0],
                "total hours": calcTotalHours(salary.hours) || "",
                "total sum": calcTotalSum(salary) || "",
            })) || [];

        const totalHours = data.reduce(
            (acc, curr) => acc + (Number(curr["total hours"]) || 0),
            0
        );
        const totalSum = data.reduce(
            (acc, curr) => acc + (Number(curr["total sum"]) || 0),
            0
        );
        return [
            ...data,
            {
                id: "total",
                workplace: "Total",
                "total hours": `${totalHours.toFixed(2)}`,
                "total sum": `${totalSum.toFixed(2)}`,
            },
        ];
    }, [calcTotalHours, calcTotalSum, fetchedSalaries, workplaces]);

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

            const response = await sendApiRequest("/salary", HTTPMethodTypes.POST, finalData);
            console.log(response.data);
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
    };
};

export default useSalary;