import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import HorizontalFlatlist from "../../components/HorizontalFlatlist";
import axios from "axios";

const { width, height } = Dimensions.get("window");

function DetailScreen({ route, navigation }) {
  const item = route.params;
  const [hourlyForecast, setHourlyForecast] = useState([]);

  useEffect(() => {
    const fetchHourlyForecast = async () => {
      try {
        const response = await axios.get(
          "https://api.openweathermap.org/data/2.5/forecast",
          {
            params: {
              lat: item.coord.lat,
              lon: item.coord.lon,
              units: "metric",
              appid: "24f40166e842079cad21bf954642b936",
            },
          }
        );

        // Extract the first 5 time slots for simplicity
        const forecast = response.data.list.map((f) => ({
          time: f.dt_txt.split(" ")[1].slice(0, 5), // Extract only the time part
          temperature: Math.round(f.main.temp), // Round the temperature
          icon: `http://openweathermap.org/img/wn/${f.weather[0].icon}.png`, // Weather icon URL
          backgroundColor: "#FBFFF1", // Set a background color
          ...f,
        }));
        setHourlyForecast(forecast);
      } catch (error) {
        // console.error(error);
      }
    };

    fetchHourlyForecast();
  }, [item.coord.lat, item.coord.lon]);

  const HandleOnPress = () => {
    navigation.navigate("Report", { data: hourlyForecast, name: item.name });
  };

  return (
    <View style={[styles.container, { backgroundColor: item.backgroundColor }]}>
      <Text style={styles.location}>{item.name}</Text>
      <Image
        source={item.weatherIcon}
        style={styles.icon}
        testID="weather-icon"
      />
      <Text style={styles.temperature}>{item.main.temp}°C</Text>
      <Text style={styles.currentWeather}>{item.weather[0].main}</Text>

      <View style={styles.additionalInfoContainer}>
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>Wind</Text>
          <Text style={styles.infoValue}>{item.wind.speed}km/h</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>Humidity</Text>
          <Text style={styles.infoValue}>{item.main.humidity}%</Text>
        </View>
      </View>
      <Pressable
        onPress={HandleOnPress}
        style={{
          padding: 20,
        }}
      >
        <Text>Show full report</Text>
      </Pressable>
      <HorizontalFlatlist hourlyForecast={hourlyForecast.slice(0, 5)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  location: {
    fontSize: 32,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  icon: {
    width: width * 0.5, // 50% of screen width
    height: height * 0.2, // 20% of screen height
    resizeMode: "contain",
    marginBottom: height * 0.01, // 1% of screen height
  },
  temperature: {
    fontSize: 64,
    fontWeight: "300",
    color: "#333",
    marginBottom: 10,
  },
  currentWeather: {
    fontSize: 20,
    color: "#666",
    marginBottom: 10,
  },
  additionalInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 30,
  },
  infoBlock: {
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 18,
    color: "#666",
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
  },
});

export default DetailScreen;
