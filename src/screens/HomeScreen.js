import React, { useEffect, useState } from 'react';
import {
  View, FlatList, SafeAreaView, StyleSheet,
  TextInput, Text, ActivityIndicator,
} from 'react-native';
import WeatherCard from '../../components/WeatherCard';
import API from '../../Utils/API';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

function HomeScreen({ navigation }) {
  const [weatherData, setWeatherData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [searchcoordinates, setSearchCoordinates] = useState();
  const [errorText, setErrorText] = useState(null);
  const [isloading, setIsloading] = useState(false);

  useEffect(() => {
    if (coordinates.length > 0) {
      GetWeatherData(coordinates);
    } else {
      setWeatherData([]);
      setFilteredData([]);
      setIsloading(false);
      setErrorText(null);
    }
  }, [coordinates]);

  useEffect(() => {
    loadCoordinates();
  }, []);

  useEffect(() => {
    if (searchText) {
      AdditionalCountryWeatherData();
    } else {
      setFilteredData(weatherData);
    }
  }, [searchText, weatherData]);

  function addLocation() {
    saveCoordinates(searchcoordinates);
  }

  function removeLocation(coord, name) {
    removeCoordinates(coord.lat, coord.lon, name);
  }

  function AdditionalCountryWeatherData() {
    setErrorText(null);
    setIsloading(true);
    const filtered = weatherData.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    if (filtered.length > 0) {
      setIsloading(false);
      setFilteredData(filtered);
      return;
    }
    API.get('/weather', {
      params: {
        q: searchText.toLowerCase(),
        units: 'metric',
      },
    })
      .then((result) => {
        const { lat, lon } = result.data.coord;
        setSearchCoordinates({ lat, lon, name: result.data.name });
        setFilteredData([result.data]);
        setIsloading(false);
      })
      .catch((error) => {
        setFilteredData([]);
        setErrorText('Country not found');
        setIsloading(false);
      });
  }

  const loadCoordinates = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('coordinates');
      const loadedCoordinates = jsonValue != null ? JSON.parse(jsonValue) : [];
      setCoordinates(loadedCoordinates);
    } catch (error) {
      console.log('Error loading coordinates:', error);
    }
  };

  const saveCoordinates = async (newCoordinate) => {
    try {
      if (
        coordinates.filter((item) => item.name == newCoordinate.name).length > 0
      ) {
        return;
      }
      const updatedCoordinates = [...coordinates, newCoordinate];
      setCoordinates(updatedCoordinates);
      const jsonValue = JSON.stringify(updatedCoordinates);
      await AsyncStorage.setItem('coordinates', jsonValue);
    } catch (error) {
      console.log('Error saving coordinates:', error);
    }
  };

  const removeCoordinates = async (lat, lon, name) => {
    try {
      const updatedCoordinates = coordinates.filter(
        (item) => item.name != name
      );
      setCoordinates(updatedCoordinates);
      const jsonValue = JSON.stringify(updatedCoordinates);
      await AsyncStorage.setItem('coordinates', jsonValue);
    } catch (error) {
      console.log('Error removing coordinates:', error);
    }
  };

  function GetWeatherData(coordinateList) {
    setIsloading(true);
    const weatherRequests = coordinateList.map((item) =>
      API.get('/weather', {
        params: {
          lat: item.lat,
          lon: item.lon,
          units: 'metric',
        },
      })
    );

    axios
      .all(weatherRequests)
      .then(
        axios.spread((...result) => {
          const data = result.map((item) => item.data);
          setWeatherData(data);
          setFilteredData(data); // Initialize filtered data
          setIsloading(false);
        })
      )
      .catch((error) => {
        console.log(error);
        setIsloading(false);
      });
  }

  async function schedulePushNotification(title, body) {
    console.log(title, body);
    const value = await AsyncStorage.getItem('notification-enabled');
    if (value == 'true') {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
        },
        trigger: null,
      });
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#555" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search and Add Cities"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
        </View>
        {isloading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6200ea" />
          </View>
        ) : errorText ? (
          <Text style={styles.errorText}>{errorText}</Text>
        ) : (
          <FlatList
            ListEmptyComponent={
              <View style={styles.loadingContainer}>
                <Text style={styles.emptyText}>No Cities Added! Please Add City!</Text>
              </View>
            }
            data={filteredData}
            renderItem={({ item }) => (
              <WeatherCard
                addLocation={addLocation}
                removeLocation={() => removeLocation(item.coord, item.name)}
                isAdded={
                  coordinates.find(
                    (coord) =>
                      coord.lat === item.coord.lat &&
                      coord.lon === item.coord.lon
                  ) !== undefined
                }
                location={item.name}
                temperature={item.main.temp}
                currentWeather={item.weather[0].main}
                handleOnPress={async (color, weatherIcon) => {
                  await schedulePushNotification(
                    `Weather Update: ${item.main.temp}°C`,
                    `Current weather is ${item.weather[0].description} in ${item.name}`
                  );
                  navigation.navigate('Detail', {
                    backgroundColor: color,
                    weatherIcon: weatherIcon,
                    ...item,
                  });
                }}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  emptyText: {
    color: '#757575',
    fontSize: 16,
  },
});

export default HomeScreen;
