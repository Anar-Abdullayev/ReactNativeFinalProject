import { createSlice } from "@reduxjs/toolkit";

interface WeatherState {
    suggestions: any[],
    weatherData: any | null;
}

const initialState: WeatherState = {
  suggestions: [],
  weatherData: null,
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setSuggestions: (state, action) => {
        state.suggestions = action.payload;
    },
    setWeatherData: (state, action) => {
        state.weatherData = action.payload;
        state.suggestions = [];
    }
  },
});

export default weatherSlice.reducer;
export const { setSuggestions, setWeatherData } = weatherSlice.actions;