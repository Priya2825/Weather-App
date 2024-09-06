import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import PagerView from "react-native-pager-view";

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

function IntroductionCarousel() {
  return (
    <PagerView style={styles.pagerView} initialPage={0}>
      <View style={styles.page} key="1">
        <Text style={styles.text}>Welcome to WeatherPro</Text>
        <Text style={styles.subtext}>Swipe to continue</Text>
      </View>
      <View style={styles.page} key="2">
        <Text style={styles.text}>
          Stay ahead of the weather with accurate forecasts and personalized
          alerts.
        </Text>
      </View>
      <View style={styles.page} key="3">
        <Text style={styles.text}>
          Weather updates for your specific location
        </Text>
      </View>
    </PagerView>
  );
}

const styles = StyleSheet.create({
  pagerView: {
    height: "100%",
    width: "100%",
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "transparent",
    paddingBottom: 60, // Adds space at the bottom to move text higher
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0000FF",
    // fontFamily: 'Nunito',
    textAlign: "center",
    letterSpacing: 1.2,
    lineHeight: 28,
  },
  subtext: {
    fontSize: 16,
    color: "#0000FF",
    // fontFamily: 'Nunito',
    textAlign: "center",
    letterSpacing: 1,
    lineHeight: 22,
    marginTop: 10,
  },
});

export default IntroductionCarousel;
