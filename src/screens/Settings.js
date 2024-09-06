import React, { useState, useEffect } from "react";
import { View, Switch, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Setting = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  useEffect(() => {
    const loadNotification = async () => {
      try {
        const value = await AsyncStorage.getItem("notification-enabled");
        setIsEnabled(value == "true");
        // console.log(value);
      } catch (e) {
        // error reading value
      }
    };
    // const requestNotificationPermission = async () => {
    //         const { status } = await Notifications.requestPermissionsAsync();
    //         if (status !== 'granted') {
    //             Alert.alert("Permission Required", "Notification permission is required.");
    //         } else {
    //             await AsyncStorage.setItem('notification-enabled', 'true');
    //             setIsEnabled(true);
    //         }
    //     };
    // requestNotificationPermission()
    loadNotification();
  }, []);

  const toggleNotification = async () => {
    const notificationEnabled = !isEnabled;
    setIsEnabled(notificationEnabled);
    try {
      await AsyncStorage.setItem(
        "notification-enabled",
        notificationEnabled.toString()
      );
    } catch (e) {
      // saving error
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text>Enable Notifications</Text>
        <Switch
          testID="switch"
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleNotification}
          value={isEnabled}
        />
      </View>
      <Text></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

export default Setting;
