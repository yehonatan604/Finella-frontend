
import { TBalanceEntry } from "../../BalanceEntries/types/TBalanceEntry";
import { TNote } from "../../Notes/types/TNote";
import { TNoteAutomation } from "../../Notes/types/TNoteAutomation";
import { TSalary } from "../../Salaries/types/TSalary";
import { TToDo } from "../../Todos/types/TToDo";
import { TWorkplace } from "../../Workplaces/types/TWorkplace";

export type TEntity = TBalanceEntry | TSalary | TWorkplace | TNote | TNoteAutomation | TToDo;
export type TEntityType = "balanceEntries" | "salaries" | "workplaces" | "notes" | "noteAutomations" | "todos";