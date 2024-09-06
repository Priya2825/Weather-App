import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

// Import images for different weather conditions
import SunnyIcon from "../images/sunny.png";
import CloudyIcon from "../images/cloudy.png";
import SnowyIcon from "../images/snowy.png";
import RainyIcon from "../images/rainy.png";

function NextForecastCard({
  testID,
  dt_txt,
  location,
  temperature,
  currentWeather,
  handleOnPress = () => {},
}) {
  let weatherIcon;

  // Conditional rendering of the weather icon
  switch (currentWeather) {
    case "Sunny":
      weatherIcon = SunnyIcon;
      break;
    case "Clouds":
      weatherIcon = CloudyIcon;
      break;
    case "Snowy":
      weatherIcon = SnowyIcon;
      break;
    case "Rain":
      weatherIcon = RainyIcon;
      break;
    default:
      weatherIcon = null; // or a default icon
      break;
  }

  const color = getBackgroundColor(currentWeather);

  return (
    <TouchableOpacity
      testID={testID}
      onPress={() => handleOnPress(color, weatherIcon)}
      style={styles.card}
    >
      <View style={[styles.cardContent, { backgroundColor: color }]}>
        <Image source={weatherIcon} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.dt_txt}>{dt_txt}</Text>
          <Text style={styles.currentWeather}>{currentWeather}</Text>
          <Text style={styles.temperature}>{temperature}°C</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const getBackgroundColor = (currentWeather) => {
  switch (currentWeather) {
    case "Sunny":
      return "#FFE066"; // Soft Yellow for sunny
    case "Clouds":
      return "#90A4AE"; // Cool Blue-Grey for cloudy
    case "Snowy":
      return "#ADD8E6"; // Soft blue for humid
    case "Rain":
      return "#4FC3F7"; // Vivid Sky Blue for rainy
    case "Partly Cloudy":
      return "#B0C4DE"; // Light Steel Blue for partly cloudy
    default:
      return "#FFFFFF"; // Default white
  }
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardContent: {
    flexDirection: "row",
    padding: 20,
    borderRadius: 20,
  },
  icon: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  location: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  currentWeather: {
    fontSize: 18,
    color: "#666",
  },
  temperature: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
});

export default NextForecastCard;
