import React, { useCallback, useEffect, useState, useRef } from "react";
import { registerRootComponent } from "expo";
import { View, Text, Platform, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabNavigator from "./src/navigator/BottomTabNavigator";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import * as Location from "expo-location";
import API from "./Utils/API";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import Entypo from "@expo/vector-icons/Entypo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IntroductionScreen from "./src/screens/IntroductionScreen";

// Set notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Prevent auto-hide splash screen
SplashScreen.preventAutoHideAsync();

function App() {
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState([]);
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [appIsReady, setAppIsReady] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts
        await Font.loadAsync(Entypo.font);
        // Artificial delay for demo purposes
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    async function GetCurrentLocationTemperature() {
      if (!coordinates) {
        return;
      }
      API.get("/weather", {
        params: {
          lat: coordinates.coords.latitude,
          lon: coordinates.coords.longitude,
          units: "metric",
        },
      })
        .then(async (result) => {
          setWeatherData(result.data);
          await schedulePushNotification(
            `Weather Update: ${result.data.main.temp}°C`,
            `Current weather is ${result.data.weather[0].description} in ${result.data.name}`
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
    const intervalId = setInterval(GetCurrentLocationTemperature, 1000000);
    return () => clearInterval(intervalId);
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

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token)
    );

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? [])
      );
    }
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    const checkIfFirstLaunch = async () => {
      try {
        const hasSeenCarousel = await AsyncStorage.getItem("hasSeenCarousel");
        if (hasSeenCarousel === null) {
          setShowCarousel(true);
        }
      } catch (error) {
        console.error("Failed to load data from AsyncStorage", error);
      } finally {
        setLoading(false);
      }
    };

    checkIfFirstLaunch();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync(); // Hide the splash screen
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null; // Render nothing while the app is not ready
  }
  const handleFinishCarousel = async () => {
    try {
      await AsyncStorage.setItem("hasSeenCarousel", "true");
    } catch (error) {
      console.error("Failed to save data to AsyncStorage", error);
    }
    setShowCarousel(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (showCarousel) {
    return <IntroductionScreen onFinish={handleFinishCarousel} />;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    </View>
  );
}

async function schedulePushNotification(title, body) {
  console.log(title, body);
  const value = await AsyncStorage.getItem("notification-enabled");
  if (value == "true") {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        //data: { data: 'goes here', test: { test1: 'more data' } },
      },
      trigger: null,
    });
  }
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

export default registerRootComponent(App);
