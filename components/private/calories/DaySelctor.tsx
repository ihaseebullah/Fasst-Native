import { Colors } from "../../../constants/Colors"; // Assuming Colors is imported from the right path
import  Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useEffect } from "react";
import {
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";

const DaySelector = ({ daysOfWeek, selectedDay, setSelectedDay }) => {
  useEffect(() => {
    if (!selectedDay && daysOfWeek.length > 0) {
      setSelectedDay(daysOfWeek[0].id);
    }
  }, [daysOfWeek, selectedDay, setSelectedDay]);

  const renderDay = ({ item }) => {
    const isSelected = selectedDay === item.id;

    return (
      <TouchableOpacity
        style={[styles.dayContainer, isSelected && styles.selectedDayContainer]}
        onPress={() => setSelectedDay(item.id)}
      >
        <Ionicons
          name="calendar"
          size={20}
          color={isSelected ? Colors.Secondary : Colors.TextSecondary} // Change icon color based on selection
          style={styles.icon} // Added style for icon spacing
        />
        <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
          {item.day}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ paddingHorizontal: 10 }}>
      <FlatList
        inverted={true}
        data={daysOfWeek}
        renderItem={renderDay}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dayList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dayList: {
    maxHeight: 50,
    marginBottom: 20,
  },
  dayContainer: {
    backgroundColor: Colors.Primary, // Dark background for non-selected days
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginHorizontal: 10,
    maxHeight: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.Primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 35,
    borderWidth: 1,
    borderColor: Colors.CardBorder, // Border color for non-selected days
    flexDirection: "row", // Added for icon and text alignment
  },
  selectedDayContainer: {
    backgroundColor: Colors.Blue, // Use Colors.Blue for selected day background
    borderWidth: 0, // Remove border for selected day
  },
  dayText: {
    color: Colors.TextPrimary, // Light text color for dark background
    fontSize: 16,
    marginLeft: 5, // Added margin for spacing between icon and text
  },
  selectedDayText: {
    color: Colors.Secondary, // Light text color for contrast against blue background
  },
  icon: {
    marginRight: 5,
  },
});

export default DaySelector;
