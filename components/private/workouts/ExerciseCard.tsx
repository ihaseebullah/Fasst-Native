import React from "react";
import {
  TouchableOpacity,
  Image,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Importing vector icons
import { Colors } from "../../../constants/Colors"; // Adjust this import path as necessary
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window"); // Get the device screen width

// Redesigned ExerciseCard component for top-level cards
const ExerciseCard = ({ item, onPress }) => {
  console.log(item);
  return (
    <TouchableOpacity
      style={[
        styles.topCard,
        { backgroundColor: item.status ? Colors.Blue : Colors.CardBackground },
      ]}
      onPress={onPress}
    >
      <View style={styles.topCardContent}>
        <View style={styles.detailsContainer}>
          <Text style={styles.topCardText}>
            {capitalizeFirstLetter(item.name)}
          </Text>
          <Text style={styles.targetText}>Target: {item.bodyPart}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
// Redesigned ExerciseCardL component for list-level cards
const ExerciseCardL = ({ item, onPress }) => (
  <TouchableOpacity style={styles.bottomCard} onPress={onPress}>
    <Image source={{ uri: item.gifUrl }} style={styles.bottomCardImage} />
    <View style={styles.bottomCardDetails}>
      <Text style={styles.bottomCardTitle}>
        {capitalizeFirstLetter(item.name)}
      </Text>
      <Text style={styles.targetText}>Target Body: {item.bodyPart}</Text>
      <Text style={styles.targetText}>Target: {item.target}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  topCard: {
    backgroundColor: Colors.CardBackground,
    borderRadius: 10,
    margin: 5,
    overflow: "hidden",
    width: width * 0.5,
    height: height * 0.135,
    borderColor: Colors.CardBorder,
    borderWidth: 1,
    flexDirection: "row",
    elevation: 3,
  },
  topCardImage: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  topCardContent: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  detailsContainer: {
    flex: 1,
  },
  topCardText: {
    color: Colors.TextPrimary,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  targetText: {
    color: Colors.TextSecondary,
    fontSize: 14,
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  icon: {
    marginRight: 15,
  },
  bottomCard: {
    backgroundColor: Colors.CardBackground,
    borderRadius: 10,
    margin: 10,
    padding: 10,
    borderColor: Colors.CardBorder,
    width: width - 30,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // Adding shadow for depth
  },
  bottomCardImage: {
    width: 115,
    height: 135,
    borderRadius: 10,
    marginRight: 10,
  },
  bottomCardDetails: {
    flex: 1,
    justifyContent: "center",
  },
  bottomCardTitle: {
    color: Colors.TextPrimary,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export { ExerciseCard, ExerciseCardL };
