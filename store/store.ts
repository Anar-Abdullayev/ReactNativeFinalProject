import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profile/profileSlice";
import tasksReducer from "./tasks/tasksSlice";
import weatherReducer from "./weather/weatherSlice";

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        weather: weatherReducer,
        profile: profileReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
