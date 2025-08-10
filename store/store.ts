import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./tasks/tasksSlice";
import weatherReducer from "./weather/weatherSlice";

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        weather: weatherReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
