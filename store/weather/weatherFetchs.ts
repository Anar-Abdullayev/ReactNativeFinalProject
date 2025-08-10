import { API_KEY } from "@/constants/API_KEY";
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
      dispatch(setWeatherData(data));
    } catch (err) {
      console.error(err);
    }
  };
