import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profile/profileSlice";
import settingsReducer from "./settings/settingsSlice";
import tasksReducer from "./tasks/tasksSlice";
import weatherReducer from "./weather/weatherSlice";

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        weather: weatherReducer,
        profile: profileReducer,
        settings: settingsReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
