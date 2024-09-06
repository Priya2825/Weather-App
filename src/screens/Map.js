import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import MapTile from "../../components/MapTile";
import * as Location from "expo-location";
import API from "../../Utils/API";

function Map() {
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    async function GetCurrentLocationTemperature() {
      API.get("/weather", {
        params: {
          lat: coordinates.coords.latitude,
          lon: coordinates.coords.longitude,
          units: "metric",
        },
      })
        .then((result) => {
          setWeatherData(result.data);
        })
        .catch((error) => {
          // console.log(error);
        });
    }
    if (coordinates) {
      GetCurrentLocationTemperature();
    }
  }, [coordinates]);

  useEffect(() => {
    async function GetLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission is denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync();
      setCoordinates(location);
    }
    GetLocation();
  }, []);
  let text = "Waiting...";
  if (error) {
    text = error;
  } else if (coordinates) {
    text = JSON.stringify(coordinates);
  }
  return (
    <View style={{ flex: 1 }}>
      {coordinates && weatherData && (
        <MapTile
          coordinates={coordinates}
          temperature={weatherData.main.temp}
        />
      )}
    </View>
  );
}

export default Map;
