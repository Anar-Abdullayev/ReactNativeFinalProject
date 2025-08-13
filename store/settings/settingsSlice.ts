import { StorageKeys } from "@/constants/STORAGE_KEY";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Settings {
    language: string,
    isDarkTheme: boolean
}

export const loadSettings = createAsyncThunk<Settings | null>('settings/loadSettings', async () => {
    const storedSettings = await AsyncStorage.getItem(StorageKeys.SETTINGS_DATA_STORAGE_KEY);
    if (storedSettings) {
        const settingsData = JSON.parse(storedSettings);
        return settingsData
    }
    return null;
})

const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        language: 'en',
        isDarkTheme: false
    },
    reducers: {
        setLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload;
            AsyncStorage.setItem(StorageKeys.SETTINGS_DATA_STORAGE_KEY, JSON.stringify(state));
        },
        setTheme: (state, action: PayloadAction<boolean>) => {
            state.isDarkTheme = action.payload;
            AsyncStorage.setItem(StorageKeys.SETTINGS_DATA_STORAGE_KEY, JSON.stringify(state));
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadSettings.fulfilled, (state, action: PayloadAction<Settings | null>) => {
            if (action.payload) {
                state.language = action.payload.language;
                state.isDarkTheme = action.payload.isDarkTheme
            }
        })
    }
})

export default settingsSlice.reducer;
export const { setLanguage, setTheme } = settingsSlice.actions;