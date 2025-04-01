import { TSalary } from "../types/TSalary";
import { TSalaryHours } from "../types/TSalaryHours";
import { TWorkplace } from "../types/TWorkplace";

export const salaryRows = (
    fetchedSalaries: TSalary[],
    workplaces: TWorkplace[],
    calcTotalHours: (hours: TSalaryHours[]) => number,
    calcTotalSum: (salary: TSalary) => number
) => {
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
}