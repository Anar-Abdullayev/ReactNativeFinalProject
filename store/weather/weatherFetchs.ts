import { API_KEY } from "@/constants/API_KEY";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setSuggestions, setWeatherData } from "./weatherSlice";

export const fetchSuggestions = (text: string) => async (dispatch: any) => {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        text
      )}&limit=5&appid=${API_KEY}`
    );
    const data = await res.json();
    dispatch(setSuggestions(data));
  } catch (err) {
    console.error(err);
  }
};

export const weatherDataFetch =
  (lat: number, lon: number) => async (dispatch: any) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const data = await res.json();
      await AsyncStorage.setItem('weatherData', JSON.stringify(data));
      dispatch(setWeatherData(data));
    } catch (err) {
      const jsonString = await AsyncStorage.getItem('weatherData');
      if (jsonString) {
        const cachedData = JSON.parse(jsonString);
        dispatch(setWeatherData(cachedData));
      }
      console.error(err);
    }
  };
