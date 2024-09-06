import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';

export default function SmallWeatherCard({ item }) {
  return (
    <View
      style={[
        styles.hourlyForecastCard,
        { backgroundColor: item.backgroundColor },
      ]}>
      <Text style={styles.hourlyTime}>{item.time}</Text>
      <Image source={{ uri: item.icon }} style={styles.hourlyIcon} />
      <Text style={styles.hourlyTemp}>{item.temperature}°C</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hourlyForecastCard: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    padding: 10,
    borderRadius: 20,
    width: 120,
    backgroundColor: '#FBFFF1',
  },
  hourlyTime: {
    fontSize: 18,
    color: '#3C3744',
    marginBottom: 5,
  },
  hourlyIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  hourlyTemp: {
    fontSize: 18,
    fontWeight: '500',
    color: '#3C3744',
    marginTop: 5,
  },
});
