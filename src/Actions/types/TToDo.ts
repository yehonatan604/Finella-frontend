import { TDbItem } from "./TDbItem";
import { TTask } from "./TTask";

export type TToDo = TDbItem & {
    userId: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    toDoStatus: "PENDING" | "COMPLETE" | "CANCELED" | "FAILED";
    tasks?: TTask[] | undefined;
    notes: string;
};