import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import socketSlice from "./socketSlice";

const store = configureStore({
    reducer: { authSlice, socketSlice },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false,
        })
    },
});

export type TRootState = ReturnType<typeof store.getState>;
export default store;