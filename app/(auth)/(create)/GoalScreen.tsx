// @ts-nocheck
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  ToastAndroid,
} from "react-native";
import { Colors } from "../../../constants/Colors"; // Assuming Colors contains Primary and Secondary colors
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Server } from "../../../constants/Configs";
import { UserContext } from "../../../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomPicker from "../../../components/shared/CustomPicker"; // Import CustomPicker
import DateTimePicker from "@react-native-community/datetimepicker"; // Import DateTimePicker

const GoalScreen = () => {
  const [goalType, setGoalType] = useState("");
  const [targetBody, setTargetBody] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [calories, setCalories] = useState("");
  const [showTargetBody, setShowTargetBody] = useState(false);
  const { setUser, user } = useContext(UserContext);
  const navigation = useNavigation();

  const bodyParts = [
    "Back",
    "Cardio",
    "Chest",
    "Lower Arms",
    "Lower Legs",
    "Neck",
    "Shoulders",
    "Upper Arms",
    "Upper Legs",
    "Waist",
  ];

  const goalTypes = [
    { label: "GYM", value: "GYM" },
    // { label: "Caloric Intake", value: "CALORIC INTAKE" },
  ];

  const handleGoalTypeChange = (value) => {
    setGoalType(value);
    setShowTargetBody(value === "GYM");
  };

  const handleTargetBodyChange = (bodyPart) => {
    setTargetBody((prev) =>
      prev.includes(bodyPart)
        ? prev.filter((part) => part !== bodyPart)
        : [...prev, bodyPart]
    );
  };

  const handleSubmit = () => {
    if (!goalType) {
      Alert.alert("Validation Error", "Please select a goal type.");
      return;
    }

    if (goalType === "GYM" && targetBody.length === 0) {
      Alert.alert(
        "Validation Error",
        "Please select at least one target body part."
      );
      return;
    }

    if (goalType === "CALORIC INTAKE" && !calories) {
      Alert.alert("Validation Error", "Please enter a caloric intake goal.");
      return;
    }

    const targetBodyLowerCase = targetBody.map((part) => part.toLowerCase());

    axios
      .post(`${Server}/api/goals-data-gathering/create-goal/`, {
        targetBody: targetBodyLowerCase,
        goalType,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        calories,
        userId: user._id,
      })
      .then(async (res) => {
        if (res.status === 201) {
          ToastAndroid.show("Goal saved successfully", ToastAndroid.SHORT); // Show success toast message
          setUser(res.data.user);
          await AsyncStorage.setItem("App_Data", JSON.stringify(res.data.user));
          navigation.reset({
            index: 0,
            routes: [{ name: "Diet_Screen" }],
          });
        }
      })
      .catch((err) => {
        console.log(err); // Logs the error details to the console
        ToastAndroid.show("Failed to set goals", ToastAndroid.SHORT);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Set Your Goal</Text>
      <Text style={styles.subtitle}>Define your fitness target</Text>

      {/* Goal Type Picker */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Goal Type</Text>
        <CustomPicker
          selectedValue={goalType}
          onValueChange={handleGoalTypeChange}
          items={goalTypes}
          placeholder="Select a goal type"
        />
      </View>

      {/* Target Body Parts (Conditional) */}
      {showTargetBody && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Target Body Parts</Text>
          <View style={styles.bodyPartsContainer}>
            {bodyParts.map((part) => (
              <TouchableOpacity
                key={part}
                style={[
                  styles.bodyPart,
                  targetBody.includes(part) && styles.bodyPartSelected,
                ]}
                onPress={() => handleTargetBodyChange(part)}
              >
                <Text
                  style={[
                    styles.bodyPartText,
                    targetBody.includes(part) && styles.bodyPartTextSelected,
                  ]}
                >
                  {part}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Start Date Picker */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Start Date</Text>
        <TouchableOpacity
          style={styles.datePicker}
          onPress={() => setShowStartPicker(true)}
        >
          <Text style={styles.datePickerText}>
            {startDate.toISOString().split("T")[0]}
          </Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowStartPicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}
      </View>

      {/* End Date Picker */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>End Date</Text>
        <TouchableOpacity
          style={styles.datePicker}
          onPress={() => setShowEndPicker(true)}
        >
          <Text style={styles.datePickerText}>
            {endDate.toISOString().split("T")[0]}
          </Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowEndPicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}
      </View>

      {/* Caloric Intake Goal (Conditional) */}
      {goalType === "CALORIC INTAKE" && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Caloric Intake Goal (Kcal)</Text>
          <TextInput
            style={styles.input}
            value={calories}
            onChangeText={setCalories}
            placeholder="Enter caloric goal"
            placeholderTextColor={Colors.TextSecondary}
            keyboardType="numeric"
          />
        </View>
      )}

      {/* Submit Button */}
      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Save Goal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.Primary, // Dark background
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.Secondary, // Light color for title
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.TextSecondary, // Lighter text color for subtitle
    marginBottom: 20,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: Colors.TextPrimary, // Light gray for labels
    marginBottom: 5,
  },
  bodyPartsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  bodyPart: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: Colors.CardBackground, // Background color for unselected body parts
    borderRadius: 20,
    marginBottom: 10,
    minWidth: "30%",
    alignItems: "center",
  },
  bodyPartSelected: {
    backgroundColor: Colors.Blue, // Background color for selected body parts
  },
  bodyPartText: {
    color: Colors.TextPrimary, // Text color for unselected body parts
    fontSize: 14,
  },
  bodyPartTextSelected: {
    color: Colors.Secondary, // Text color for selected body parts
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.CardBackground, // Darker gray background for input fields
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: Colors.TextPrimary, // Light text for input
  },
  datePicker: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.CardBackground, // Darker gray background for date picker
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  datePickerText: {
    color: Colors.TextPrimary, // Light text color for date picker
    fontSize: 16,
  },
  submitButton: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.Blue, // Blue button color for action
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: Colors.Secondary, // Light text on button
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default GoalScreen;
