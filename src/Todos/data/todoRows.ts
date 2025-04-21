import { formatDateLuxon } from "../../Common/helpers/dateHelpers";
import { TToDo } from "../types/TToDo";

export const todoRows = (fetchedToDos: TToDo[]) => {
    return (
        fetchedToDos.map((todo) => ({
            id: todo._id,
            name: todo.name,
            description: todo.description,
            startDate: formatDateLuxon(todo.startDate),
            endDate: formatDateLuxon(todo.endDate),
            toDoStatus: todo.toDoStatus,
            tasks: todo.tasks?.length,
            status: todo.status,
        })) || []
    );
};