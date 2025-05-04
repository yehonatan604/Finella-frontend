import { TDbItem } from "../../Common/types/TDbItem";
import { TTask } from "../../Records/types/TTask";
import { TTaskStastus } from "../../Records/types/TTaskStatus";

export type TToDo = TDbItem & {
    userId: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    toDoStatus: TTaskStastus;
    tasks?: TTask[] | undefined;
    notes: string;
};