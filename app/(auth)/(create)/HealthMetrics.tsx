import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  Keyboard,
  TouchableWithoutFeedback, // Import TouchableWithoutFeedback
} from "react-native";
import { Colors } from "../../../constants/Colors"; // Adjust import path as necessary
import axios from "axios";
import { UserContext } from "../../../context/UserContext";
import { Server } from "../../../constants/Configs";
import Loader from "../../../components/shared/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomPicker from "../../../components/shared/CustomPicker"; // Import CustomPicker

const activityLevels = [
  { label: "Sedentary (little to no exercise)", value: 1.2 },
  {
    label: "Lightly active (light exercise/sports 1-3 days a week)",
    value: 1.375,
  },
  {
    label: "Moderately active (moderate exercise/sports 3-5 days a week)",
    value: 1.55,
  },
  { label: "Very active (hard exercise/sports 6-7 days a week)", value: 1.725 },
  {
    label: "Extra active (very hard exercise/sports & physical job)",
    value: 1.9,
  },
];

const goals = [
  { label: "Increase Weight", value: "increase" },
  { label: "Decrease Weight", value: "decrease" },
  { label: "Maintain Weight", value: "maintain" },
];

const genders = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const HealthMetrics = ({ route }) => {
  const [heightCm, setHeightCm] = useState(""); // Height in cm
  const [weight, setWeight] = useState(""); // Weight in kg
  const [age, setAge] = useState("");
  const [activityLevel, setActivityLevel] = useState(activityLevels[0].value);
  const [goal, setGoal] = useState(goals[0].value);
  const [gender, setGender] = useState(genders[0].value); // Added gender state
  const { user, setUser, setAppData } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleSaveMetrics = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${Server}/api/init/data-gathering/health-matrix`,
        {
          userId: user._id,
          height: parseFloat(heightCm) / 100, // Convert height to meters
          weight: parseFloat(weight),
          gender,
          age: parseInt(age, 10),
          activityLevel,
          goal,
        }
      );

      if (response.status === 201) {
        try {
          // Await the insights initialization API call
          await axios.get(`${Server}/api/insights/initalization/${user._id}`);

          let data = await AsyncStorage.getItem("App_Data");
          data = JSON.parse(data);

          const updatedData = {
            ...data,
            user: response.data,
          };

          await AsyncStorage.setItem("App_Data", JSON.stringify(updatedData));
          setUser(response.data);

          if (!response.data.user?.GOALS) {
            navigation.reset({
              index: 0,
              routes: [{ name: "Goal_Screen" }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: "App" }],
            });
          }
        } catch (error) {
          console.error("Error updating AsyncStorage:", error);
          ToastAndroid.show(
            "Failed to initialize insights",
            ToastAndroid.SHORT
          );
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      ToastAndroid.show(
        error.response?.data?.message || "An error occurred",
        ToastAndroid.SHORT
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {isLoading && <Loader title={"Saving."} />}
        <Text style={styles.title}>Health Metrics</Text>
        {!user.Health_Metrics && (
          <Text style={styles.subtitle}>
            Please enter your health metrics to proceed
          </Text>
        )}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            placeholder="Height (cm)"
            placeholderTextColor={Colors.TextSecondary}
            keyboardType="numeric"
            value={heightCm}
            onChangeText={setHeightCm}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="Weight (kg)"
            placeholderTextColor={Colors.TextSecondary}
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="Age"
            placeholderTextColor={Colors.TextSecondary}
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
        </View>

        <CustomPicker
          label="Gender"
          selectedValue={gender}
          onValueChange={setGender}
          items={genders}
        />

        <CustomPicker
          label="Activity Level"
          selectedValue={activityLevel}
          onValueChange={setActivityLevel}
          items={activityLevels}
        />

        <CustomPicker
          label="Goal"
          selectedValue={goal}
          onValueChange={setGoal}
          items={goals}
        />

        <TouchableOpacity style={styles.button} onPress={handleSaveMetrics}>
          <Text style={styles.buttonText}>Save Metrics</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.Primary, // Dark background
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.Secondary, // Light color for title
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.TextSecondary, // Lighter color for subtitle text
    marginBottom: 20,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: Colors.TextPrimary,
    marginBottom: 5,
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
  button: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.Blue, // Blue button color
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: Colors.Secondary, // Light text on button
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HealthMetrics;
