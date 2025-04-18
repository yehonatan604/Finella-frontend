import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "light",
    isLeftNavOpen: true,
}

const themeSlice = createSlice({
    name: "theme",
    initialState: { ...initialState },
    reducers: {
        setTheme: (state, action) => {
            state.mode = action.payload;
        },

        resetTheme: (state) => {
            state.mode = initialState.mode;
        },

        toggleLeftNav: (state) => {
            state.isLeftNavOpen = !state.isLeftNavOpen;
        },
    },
});

export type TThemState = typeof initialState;
export const themeActions = themeSlice.actions;
export default themeSlice.reducer;
