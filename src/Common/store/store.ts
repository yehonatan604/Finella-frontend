import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import socketSlice from "./socketSlice";
import themeSlice from "./themeSlice";

const store = configureStore({
    reducer: { authSlice, socketSlice, themeSlice },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false,
        })
    },
});

export type TRootState = ReturnType<typeof store.getState>;
export default store;