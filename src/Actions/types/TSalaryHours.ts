import { TDbItem } from "./TDbItem";

export type TSalaryHours = TDbItem & {
    day: string;
    startTime: string;
    endTime: string;
    breakStart: string;
    breakEnd: string;
    notes: string;
};