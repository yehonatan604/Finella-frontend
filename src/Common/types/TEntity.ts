import { TBalanceEntry } from "../../Actions/types/TBalanceEntry";
import { TSalary } from "../../Actions/types/TSalary";
import { TToDo } from "../../Actions/types/TToDo";
import { TWorkplace } from "../../Actions/types/TWorkplace";
import { TNote } from "../../Notes/types/TNote";
import { TNoteAutomation } from "../../Notes/types/TNoteAutomation";

export type TEntity = TBalanceEntry | TSalary | TWorkplace | TNote | TNoteAutomation | TToDo;
export type TEntityType = "balanceEntries" | "salaries" | "workplaces" | "notes" | "noteAutomations" | "todos";