import { Colors } from "../../constants/Colors";
import React from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";

// Get screen dimensions
const { width, height } = Dimensions.get("window");

const Loader = ({title}) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.blurBackground} />
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.Secondary} />
        <Text style={{ textAlign: "center",marginTop:10,color:Colors.Secondary }}>{title?title:"Loading"}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    zIndex: 9999, // Ensure it stays on top
  },
  loaderContainer: {
    width: 100,
    height: 100,
    borderRadius: 15,
    backgroundColor: Colors.Primary, // Background color of the loader container
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Shadow effect for Android
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.3, // Shadow opacity for iOS
    shadowRadius: 8, // Shadow radius for iOS
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.3)", // Light semi-transparent overlay
    // Mimic blur effect with semi-transparent white
    zIndex: -1, // Place blur effect behind the loader
  },
});

export default Loader;
