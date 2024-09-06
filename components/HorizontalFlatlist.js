import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import SmallWeatherCard from './SmallWeatherCard';

export default function HorizontalFlatlist({ hourlyForecast }) {
  return (
    <FlatList
      data={hourlyForecast}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <SmallWeatherCard item={item} />
      )}
      style={styles.hourlyForecastContainer}
    />
  );
}

const styles = StyleSheet.create({
  hourlyForecastContainer: {
    width: '100%',
  },
});
