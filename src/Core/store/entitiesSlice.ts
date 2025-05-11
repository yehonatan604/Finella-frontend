import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TSalary } from "../../Salaries/types/TSalary";
import { TWorkplace } from "../../Workplaces/types/TWorkplace";
import { TNote } from "../../Notes/types/TNote";
import { TNoteAutomation } from "../../Notes/types/TNoteAutomation";
import { TDbItem } from "../../Common/types/TDbItem";
import { TEntityType, TEntity } from "../../Common/types/TEntity";
import { TToDo } from "../../Todos/types/TToDo";
import { TBalanceEntry } from "../../BalanceEntries/types/TBalanceEntry";

export type TEntitiesState = {
    balanceEntries: TBalanceEntry[] | null;
    salaries: TSalary[] | null;
    workplaces: TWorkplace[] | null;
    notes: TNote[] | null;
    noteAutomations: TNoteAutomation[] | null;
    todos: TToDo[] | null;
};

const initialState: TEntitiesState = {
    balanceEntries: null,
    salaries: null,
    workplaces: null,
    notes: null,
    noteAutomations: null,
    todos: null,
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
                const index = (list as TEntity[]).findIndex((i: TDbItem) => i._id === id);
                if (index !== -1) {
                    (list as TEntity[])[index].status = "inactive";
                }
            }
        },

        undeleteEntityItem: (
            state,
            action: PayloadAction<{ type: TEntityType; id: string }>
        ) => {
            const { type, id } = action.payload;
            const list = state[type];
            if (list) {
                const index = (list as TEntity[]).findIndex((i: TDbItem) => i._id === id);
                if (index !== -1) {
                    (list as TEntity[])[index].status = "active";
                }
            }
        },
    },
});

export const entitiesActions = entitiesSlice.actions;
export default entitiesSlice.reducer;
