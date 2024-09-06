import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

const WeatherInfoScreen = () => {
  const [airData, setAirData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAirPollutionData() {
      try {
        const response = await axios.get(
          "https://api.openweathermap.org/data/2.5/air_pollution/forecast",
          {
            params: {
              lat: 44.34,
              lon: 10.99,
              appid: "24f40166e842079cad21bf954642b936",
            },
          }
        );
        setAirData(response.data);
      } catch (error) {
        // console.error("Error fetching air pollution data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAirPollutionData();
  }, []);

  const renderAirPollutionItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.dateText}>
        {new Date(item.dt * 1000).toLocaleDateString()}
      </Text>
      <Text style={styles.aqiText}>AQI: {item.main.aqi}</Text>
      <View style={styles.pollutionInfo}>
        <Text style={styles.pollutionText}>
          PM2.5: {item.components.pm2_5} μg/m³
        </Text>
        <Text style={styles.pollutionText}>
          PM10: {item.components.pm10} μg/m³
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          testID="loader-container"
          size="large"
          color="#4CAF50"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Air Pollution Forecast</Text>
      {airData && (
        <FlatList
          data={airData.list}
          renderItem={renderAirPollutionItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#E0F7FA",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#00796B",
    textAlign: "center",
    marginBottom: 20,
  },
  listContainer: {
    paddingVertical: 8,
  },
  itemContainer: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00796B",
    marginBottom: 6,
  },
  aqiText: {
    fontSize: 16,
    color: "#D32F2F",
    marginBottom: 8,
  },
  pollutionInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pollutionText: {
    fontSize: 14,
    color: "#555",
  },
});

export default WeatherInfoScreen;
