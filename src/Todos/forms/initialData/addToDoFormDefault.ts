import { TToDo } from "../../types/TToDo";

export const addToDoFormDefault = (userId: string): TToDo => {
    return {
        userId,
        name: "",
        description: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        tasks: [],
        toDoStatus: "PENDING",
        notes: "",
    }
};