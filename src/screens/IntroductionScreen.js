import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import icon from "../../images/introImage.png";
import IntroductionCarousel from "../../components/IntroductionCarousel";
import "react-native-screens";
import "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

function IntroductionScreen({ onFinish }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        testID="background-gradient"
        colors={["#8EC5FC", "#E0C3FC"]}
        style={styles.background}
      >
        <View style={styles.imageContainer}>
          <Image testID="intro-image" source={icon} style={styles.tinyLogo} />
        </View>
        <View style={styles.carouselContainer} testID="introduction-carousel">
          <IntroductionCarousel />
        </View>
        <TouchableOpacity
          testID="continue-button"
          onPress={onFinish}
          style={styles.buttonContainer}
        >
          <View style={styles.circleButton}>
            <MaterialCommunityIcons
              name="arrow-right"
              color={"#fff"}
              size={40}
            />
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF", // Background color in case the gradient fails to load
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: screenHeight,
    justifyContent: "space-between",
    alignItems: "center",
  },
  tinyLogo: {
    height: 350,
    width: 350,
    objectFit: "contain",
  },
  carouselContainer: {
    height: screenHeight / 2.5,
    width: screenWidth,
  },
  imageContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: screenHeight - screenHeight / 2.5,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  circleButton: {
    width: 60,
    height: 60,
    backgroundColor: "#4CAF50",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  arrow: {
    fontSize: 28,
    color: "#FFF",
  },
});

export default IntroductionScreen;
