import { TDbItem } from "./TDbItem";

export type TSalaryHours = TDbItem & {
    day: string;
    startTime: string;
    endTime: string;
    notes: string;
};