import { Colors } from "../../../constants/Colors";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Importing FontAwesome icons

const CaloriesDisplay = ({ consumption, goal, highestInWeek }) => {
  return (
    <View
      style={[
        styles.caloriesContainer
      ]}
    >
      <Text
        style={[
          styles.caloriesText,
          { color: goal - consumption < 0 ? Colors.Error : Colors.Blue },
        ]}
      >
        {Math.abs(goal - consumption)}
      </Text>
      <Text
        style={[
          styles.kcalText,
          { color: goal - consumption < 0 ? Colors.Error : Colors.Blue },
        ]}
      >
        kcal {goal - consumption < 0 ? "Exceeded" : "Left"}
      </Text>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Icon name="cutlery" style={styles.icon} />
          <Text style={styles.detailLabel}>Consumed Today</Text>
          <Text style={styles.detailValue}>{consumption} kcal</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="bullseye" style={styles.icon} />
          <Text style={styles.detailLabel}>Consumption Goal</Text>
          <Text style={styles.detailValue}>{goal} kcal</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="line-chart" style={styles.icon} />
          <Text style={styles.detailLabel}>Highest in a Week</Text>
          <Text style={styles.detailValue}>{highestInWeek} kcal</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  caloriesContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
    margin: 20,
    borderRadius: 15,
    backgroundColor: Colors.Primary, // Using primary color for dark mode background
    padding: 10, // Add padding for spacing inside the container
  },
  caloriesText: {
    fontSize: 54, // Reduced size to make room for additional text
    fontWeight: "bold",
    color: Colors.TextPrimary, // Main color for highlighted text in dark mode
  },
  kcalText: {
    fontSize: 34, // Slightly smaller font size
    color: Colors.TextPrimary, // Main color for highlighted text in dark mode
  },
  detailsContainer: {
    marginTop: 20,
    width: "100%",
  },
  detailRow: {
    flexDirection: "row", // Arrange label and value side by side
    alignItems: "center", // Align items vertically in the center
    justifyContent: "space-between", // Space between label and value
    marginBottom: 10, // Space between rows
    paddingHorizontal: 10, // Horizontal padding for inner spacing
    fontSize:24
  },
  icon: {
    color: Colors.TextSecondary, // Icon color for dark mode
    fontSize: 18, // Size of the icons
    marginRight: 8, // Space between icon and text
  },
  detailLabel: {
    fontSize: 16, // Lower font size for further details
    color: Colors.TextSecondary, // Text color for less emphasis in dark mode
    flex: 3, // Flex to take more space for label
    textAlign: "left", // Align text to the left
  },
  detailValue: {
    fontSize: 16, // Lower font size for further details
    color: Colors.TextPrimary, // Consistent with the theme color for text
    fontWeight: "bold",
    flex: 2, // Flex to take less space for value
    textAlign: "right", // Align text to the right
  },
});

export default CaloriesDisplay;
