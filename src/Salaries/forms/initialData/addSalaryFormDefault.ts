import { TSalary } from "../../../Salaries/types/TSalary"
import { TSalaryHours } from "../../../Salaries/types/TSalaryHours"


export const addSalaryFormDefault = (userId: string): TSalary => {
    return {
        userId,
        workPlaceId: "",
        date: new Date()
            .toLocaleDateString()
            .split(".")
            .reverse()
            .join("-")
            .split("-")
            .slice(0, 2)
            .reverse()
            .join("-"),
        hours: [] as TSalaryHours[],
        notes: "",
    }
}