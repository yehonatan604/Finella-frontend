import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TBalanceEntry } from "../../Actions/types/TBalanceEntry";
import { TSalary } from "../../Actions/types/TSalary";
import { TWorkplace } from "../../Actions/types/TWorkplace";
import { TNote } from "../../Notes/types/TNote";
import { TToDo } from "../../Actions/types/TToDo";
import { TNoteAutomation } from "../../Notes/types/TNoteAutomation";
import { TDbItem } from "../../Actions/types/TDbItem";
import { TEntityType, TEntity } from "../../Common/types/TEntity";

export type TEntitiesState = {
    balanceEntries: TBalanceEntry[] | null;
    salaries: TSalary[] | null;
    workplaces: TWorkplace[] | null;
    notes: TNote[] | null;
    noteAutomations: TNoteAutomation[] | null;
    todos: TToDo[] | null;
    loading: boolean;
};

const initialState: TEntitiesState = {
    balanceEntries: null,
    salaries: null,
    workplaces: null,
    notes: null,
    noteAutomations: null,
    todos: null,
    loading: false,
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
            state.loading = false;
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
            state.loading = false;
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
            state.loading = false;
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
            state.loading = false;
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
            state.loading = false;
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
    },
});

export const entitiesActions = entitiesSlice.actions;
export default entitiesSlice.reducer;
