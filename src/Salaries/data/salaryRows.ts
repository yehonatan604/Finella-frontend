import { TSalary } from "../types/TSalary";
import { TSalaryHours } from "../types/TSalaryHours";
import { TWorkplace } from "../../Workplaces/types/TWorkplace";

export const salaryRows = (
    fetchedSalaries: TSalary[],
    workplaces: TWorkplace[],
    calcTotalHours: (hours: TSalaryHours[]) => number,
    calcTotalSum: (salary: TSalary) => number
) => {
    const data =
        fetchedSalaries.map((salary) => {
            const workplace = workplaces.find((workplace) => workplace._id === salary.workPlaceId);
            return {
                id: salary._id,
                workplace:
                    workplace?.name ||
                    "",
                year: salary.date.split("-")[1],
                month: salary.date.split("-")[0],
                "total hours": calcTotalHours(salary.hours) || "-",
                "total sum": calcTotalSum(salary) || workplace?.pricePerMonth || "-",
                status: salary.status,
                notes: salary.notes,
            }
        }) || [];

    const totalHours = data.reduce(
        (acc, curr) => {
            if (curr.status === "inactive") return acc;
            return acc + (Number(curr["total hours"]) || 0);
        },
        0
    );
    const totalSum = data.reduce(
        (acc, curr) => {
            if (curr.status === "inactive") return acc;
            return acc + (Number(curr["total sum"]) || 0)
        },
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