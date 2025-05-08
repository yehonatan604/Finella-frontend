import { TDbItem } from "../../Common/types/TDbItem";
import { TTask } from "../../Common/types/TTask";
import { TTaskStastus } from "../../Common/types/TTaskStatus";

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