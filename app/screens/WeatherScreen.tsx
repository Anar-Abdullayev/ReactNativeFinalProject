import { formatTime } from "@/lib/dateTimeFormat";
import { AppDispatch } from "@/store/store";
import {
  fetchSuggestions,
  weatherDataFetch,
} from "@/store/weather/weatherFetchs";
import { setSuggestions } from "@/store/weather/weatherSlice";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function WeatherApp() {
  const [query, setQuery] = useState<string>("");
  const { suggestions, weatherData } = useSelector(
    (state: any) => state.weather
  );
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (weatherData)
      setQuery(`${weatherData?.name}, ${weatherData?.sys?.country}`);
  }, [weatherData]);
  const fetchCitySuggestions = async (text: string) => {
    setQuery(text);
    if (text.length > 2) dispatch(fetchSuggestions(text));
    else dispatch(setSuggestions([]));
  };

  const fetchWeather = async (lat: number, lon: number) => {
    dispatch(weatherDataFetch(lat, lon));
  };

  return (
    <TouchableWithoutFeedback onPress={() => dispatch(setSuggestions([]))}>
      <SafeAreaView style={styles.container}>
        <View style={styles.searchContainer}>
          <View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search city..."
              value={query}
              onChangeText={fetchCitySuggestions}
            />
            {query && 
            <View style={{ position: 'absolute', right: 10, top: 10 }}>
              <TouchableOpacity onPress={() => setQuery('')}>
                <MaterialIcons name="clear" size={24} color="red" />
              </TouchableOpacity>
            </View>}

          </View>
          {suggestions.length > 0 && (
            <FlatList
              data={suggestions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => fetchWeather(item.lat, item.lon)}
                >
                  <Text style={styles.suggestionText}>
                    {item.name}, {item.country}
                    {item.state ? ` (${item.state})` : ""}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        {weatherData && (
          <View style={styles.weatherContainer}>
            <Text style={styles.location}>
              {weatherData.name}, {weatherData.sys.country}
            </Text>
            <Image
              style={styles.icon}
              source={{
                uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`,
              }}
            />
            <Text style={styles.temp}>{Math.round(weatherData.main.temp)}°C</Text>
            <Text style={styles.feelsLike}>
              Feels like {Math.round(weatherData.main.feels_like)}°C
            </Text>
            <Text style={styles.description}>
              {weatherData.weather[0].description}
            </Text>

            <View style={styles.infoContainer}>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Humidity</Text>
                <Text style={styles.infoValue}>{weatherData.main.humidity}%</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Pressure</Text>
                <Text style={styles.infoValue}>
                  {weatherData.main.pressure} hPa
                </Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Wind</Text>
                <Text style={styles.infoValue}>{weatherData.wind.speed} m/s</Text>
              </View>
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Sunrise</Text>
                <Text style={styles.infoValue}>
                  {formatTime(weatherData.sys.sunrise)}
                </Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Sunset</Text>
                <Text style={styles.infoValue}>
                  {formatTime(weatherData.sys.sunset)}
                </Text>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4A90E2",
  },
  searchContainer: {
    position: 'absolute',
    width: '100%',
    padding: 10,
    zIndex: 1
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  suggestionItem: {
    backgroundColor: "#fff",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  suggestionText: {
    fontSize: 16,
    color: "#333",
  },
  weatherContainer: {
    alignItems: "center",
    marginTop: 70,
  },
  location: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "600",
  },
  icon: {
    width: 150,
    height: 150,
    marginVertical: 10,
  },
  temp: {
    fontSize: 64,
    color: "#fff",
    fontWeight: "bold",
  },
  feelsLike: {
    fontSize: 18,
    color: "#f0f0f0",
  },
  description: {
    fontSize: 22,
    color: "#fff",
    textTransform: "capitalize",
    marginVertical: 10,
  },
  infoContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  infoBox: {
    alignItems: "center",
    marginHorizontal: 15,
  },
  infoLabel: {
    color: "#e0e0e0",
    fontSize: 16,
  },
  infoValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
});
