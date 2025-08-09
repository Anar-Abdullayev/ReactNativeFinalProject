import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./tasks/tasksSlice";

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
    },
});

// Types for dispatch and state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
