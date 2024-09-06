WeatherPro

WeatherPro is a weather forecasting application that provides real-time weather data for different locations. It offers detailed weather information, including current conditions, hourly forecasts, and air pollution levels. The app uses the OpenWeatherMap API to fetch accurate weather data and allows users to explore both global and local weather updates.

Features

Current Weather: Displays real-time weather information, including temperature, wind speed, humidity, and weather conditions for a selected location.
Hourly Forecast: A visual hourly forecast showing weather icons, temperatures, and times for the upcoming hours.
Detailed Weather Reports: Users can view detailed weather reports with additional information like wind speed and humidity levels.
Interactive Map: A map feature to explore weather conditions in various locations.
Air Quality Index: Provides data about air pollution levels using the OpenWeatherMap Air Pollution API.
Dynamic UI: The app includes scrollable content with interactive elements such as weather cards and forecast navigation.
Settings Screen: Customize app preferences such as units and notifications.

To install and run the project locally:

1. download the file
2. Open terminal and write the following commands
   
  -> npx expo -h
   
  -> yarn add expo
  
  -> npx expo install
  
  -> npx expo start
  
and select ios i for ios stimulator device

3. To run the test cases write the following commands

  -> yarn add -D @testing-library/react-native
  
  -> npx expo install jest-expo jest
  
  -> npm run test

Usage

Home Screen: Displays the current weather information along with a scrollable list of hourly forecasts. Tap on any forecast to view more details.
Map Screen: Navigate to the Map screen to current weather data for different locations.
Weather Info Screen: Access air pollution data and other environmental factors.
Settings: Adjust your app preferences - notifications through the Settings screen.

Code Overview

SmallWeatherCard.js: Renders individual weather cards that display the time, temperature, and weather icon for each hourly forecast.
DetailScreen.js: Shows detailed weather information for a selected time, including temperature, wind speed, humidity, and a detailed hourly forecast.
HomeStackNavigator.js: Defines the navigation structure for the app, linking the HomeScreen, DetailScreen, and ReportScreen for smooth transitions.

