import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TBalanceEntry } from "../../Actions/types/TBalanceEntry";
import { TSalary } from "../../Actions/types/TSalary";
import { TWorkplace } from "../../Actions/types/TWorkplace";
import { TNote } from "../../Notes/types/TNote";
import { TToDo } from "../../Actions/types/TToDo";
import { TNoteAutomation } from "../../Notes/types/TNoteAutomation";
import { TDbItem } from "../../Actions/types/TDbItem";

export type TEntityType = "balanceEntries" | "salaries" | "workplaces" | "notes" | "noteAutomations" | "todos";
export type TEntity = TBalanceEntry | TSalary | TWorkplace | TNote | TNoteAutomation | TToDo;
export type TEntitiesState = {
    balanceEntries: TBalanceEntry[] | null;
    salaries: TSalary[] | null;
    workplaces: TWorkplace[] | null;
    notes: TNote[] | null;
    noteAutomations: TNoteAutomation[] | null;
    todos: TToDo[] | null;
    loading: boolean;
    error: string | null;
};

const initialState: TEntitiesState = {
    balanceEntries: null,
    salaries: null,
    workplaces: null,
    notes: null,
    noteAutomations: null,
    todos: null,
    loading: false,
    error: null,
};

const entitiesSlice = createSlice({
    name: "entities",
    initialState,
    reducers: {
        setEntity: (
            state,
            action: PayloadAction<{
                type: TEntityType;
                data: TEntity[] | null;
            }>
        ) => {
            const { type, data } = action.payload;
            state[type] = data as never;
        },

        addEntityItem: (
            state,
            action: PayloadAction<{ type: TEntityType; item: TEntity }>
        ) => {
            const { type, item } = action.payload;
            const list = state[type];
            if (list) {
                (list as TEntity[]).push(item);
            }
        },

        updateEntityItem: (
            state,
            action: PayloadAction<{ type: TEntityType; item: TEntity; id: string }>
        ) => {
            const { type, item, id } = action.payload;
            const list = state[type];
            if (list) {
                const index = (list as TEntity[]).findIndex((i: TDbItem) => i._id === id);
                if (index !== -1) {
                    (list as TEntity[])[index] = item;
                }
            }
        },

        removeEntityItem: (
            state,
            action: PayloadAction<{ type: TEntityType; id: string }>
        ) => {
            const { type, id } = action.payload;
            const list = state[type];
            if (list) {
                state[type] = (list as TEntity[]).filter((i: TDbItem) => i._id !== id) as never;
            }
        },

        clearEntities: (state) => {
            state.balanceEntries = null;
            state.salaries = null;
            state.workplaces = null;
            state.notes = null;
            state.noteAutomations = null;
            state.todos = null;
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
});

export const entitiesActions = entitiesSlice.actions;
export default entitiesSlice.reducer;
