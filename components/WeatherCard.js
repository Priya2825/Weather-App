import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';

// Import images for different weather conditions
import SunnyIcon from '../images/sunny.png';
import CloudyIcon from '../images/cloudy.png';
import SnowyIcon from '../images/snowy.png';
import RainyIcon from '../images/rainy.png';

function WeatherCard({
  location,
  temperature,
  currentWeather,
  handleOnPress,
  addLocation,
  removeLocation,
  isAdded,
}) {
  let weatherIcon;

  // Conditional rendering of the weather icon
  switch (currentWeather) {
    case 'Sunny':
      weatherIcon = SunnyIcon;
      break;
    case 'Clouds':
      weatherIcon = CloudyIcon;
      break;
    case 'Snowy':
      weatherIcon = SnowyIcon;
      break;
    case 'Rain':
      weatherIcon = RainyIcon;
      break;
    default:
      weatherIcon = null; // or a default icon
      break;
  }
  const color = getBackgroundColor(currentWeather);
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        handleOnPress(color, weatherIcon);
      }}>
      <View style={[styles.card, { backgroundColor: color }]}>
        <Image source={weatherIcon} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.location}>{location}</Text>
          <Text style={styles.currentWeather}>{currentWeather}</Text>
          <Text style={styles.temperature}>{temperature}°C</Text>
        </View>
        {!isAdded && (
          <Pressable style={styles.button} onPress={addLocation}>
            <Text style={styles.buttonText}>Add</Text>
          </Pressable>
        )}
        {isAdded && (
          <Pressable style={styles.buttonRemove} onPress={removeLocation}>
            <Text style={styles.buttonTextRemove}>Remove</Text>
          </Pressable>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

// Function to return a background color based on the weather condition
const getBackgroundColor = (currentWeather) => {
  switch (currentWeather) {
    case 'Sunny':
      return '#FFE066'; // Soft Yellow for sunny
    case 'Clouds':
      return '#90A4AE'; // Cool Blue-Grey for cloudy
    case 'Snowy':
      return '#ADD8E6'; // Soft blue for humid
    case 'Rain':
      return '#4FC3F7'; // Vivid Sky Blue for rainy
    case 'Partly Cloudy':
      return '#B0C4DE'; // Light Steel Blue for partly cloudy
    default:
      return '#FFFFFF'; // Default white
  }
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  icon: {
    width: 100, // Reduced size
    height: 100, // Reduced size
    resizeMode: 'contain',
    marginRight: 15, // Less margin to fit better
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  location: {
    fontSize: 24, // Reduced from 30
    fontWeight: '600',
    marginBottom: 2, // Less margin for better compactness
    color: '#333',
  },
  currentWeather: {
    fontSize: 16, // Slightly smaller
    color: '#333',
    fontWeight: '500',
    marginBottom: 5,
  },
  temperature: {
    fontSize: 28, // Reduced from 32
    fontWeight: '700',
    color: '#000',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8, // Less padding for a more compact button
    paddingHorizontal: 15,
    borderRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14, // Smaller text
    fontWeight: '600',
  },
  buttonRemove: {
    backgroundColor: '#f44336',
    paddingVertical: 8, // Consistent padding for both buttons
    paddingHorizontal: 15,
    borderRadius: 8,
    elevation: 2,
  },
  buttonTextRemove: {
    color: '#fff',
    fontSize: 14, // Smaller text
    fontWeight: '600',
  },
});


export default WeatherCard;
