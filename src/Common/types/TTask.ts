import { TDbItem } from "./TDbItem";
import { TTaskStastus } from "./TTaskStatus";

export type TTask = TDbItem & {
    name: string;
    priority: number;
    notes?: string;
    taskStatus: TTaskStastus;
}