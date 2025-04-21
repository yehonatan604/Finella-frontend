import { TDbItem } from "../../Records/types/TDbItem";
import { TTask } from "../../Records/types/TTask";

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