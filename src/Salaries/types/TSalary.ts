import { TDbItem } from "../../Common/types/TDbItem";
import { TSalaryHours } from "./TSalaryHours";

export type TSalary = TDbItem & {
    userId: string;
    workPlaceId: string;
    date: string;
    hours: TSalaryHours[];
    notes: string;
};