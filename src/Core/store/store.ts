import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import socketSlice from "./socketSlice";
import themeSlice from "./themeSlice";
import entitiesSlice from "./entitiesSlice";

const store = configureStore({
    reducer: { authSlice, socketSlice, themeSlice, entitiesSlice },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false,
        })
    },
});

export type TRootState = ReturnType<typeof store.getState>;
export default store;