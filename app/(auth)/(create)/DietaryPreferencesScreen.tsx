import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ToastAndroid,
  ScrollView,
} from "react-native";
import { Colors } from "../../../constants/Colors";
import { UserContext } from "../../..//context/UserContext";
import axios from "axios";
import { Server } from "../../../constants/Configs";

export default function DietaryPreferencesScreen({ navigation }) {
  const { user, setUser } = useContext(UserContext);
  const [recipesPreferences, setRecipesPreferences] = useState({
    dietaryPreference: "",
    healthGoal: "",
    cuisinePreference: "",
    mealsPerDay: "",
    allergies: [],
  });

  const questions = [
    {
      title: "What is your primary dietary preference?",
      options: ["Paleo", "Keto", "Vegan", "Mediterranean", "Dash"],
      key: "dietaryPreference",
      multiple: false,
    },
    {
      title: "Do you have any specific health goals?",
      options: ["Weight Loss", "Muscle Gain", "Heart Health"],
      key: "healthGoal",
      multiple: false,
    },
    {
      title: "What cuisines do you prefer?",
      options: ["American", "Mexican", "Chinese", "Mediterranean"],
      key: "cuisinePreference",
      multiple: false,
    },
    {
      title: "How many meals per day do you prefer?",
      options: ["2 large meals", "3 meals", "4-5 small meals"],
      key: "mealsPerDay",
      multiple: false,
    },
    {
      title: "Do you have any specific food allergies or intolerances?",
      options: ["peanuts", "shellfish", "soy", "eggs"],
      key: "allergies",
      multiple: true,
    },
  ];

  const updatePreference = (key, value) => {
    if (key === "allergies") {
      setRecipesPreferences((prevPreferences) => {
        const allergies = prevPreferences.allergies.includes(value)
          ? prevPreferences.allergies.filter((item) => item !== value)
          : [...prevPreferences.allergies, value];
        return { ...prevPreferences, allergies };
      });
    } else {
      setRecipesPreferences((prevPreferences) => ({
        ...prevPreferences,
        [key]: value,
      }));
    }
  };

  const handleSavePreferences = () => {
    axios
      .put(`${Server}/api/data-gathering/diet-plan/${user._id}`, {
        ...recipesPreferences,
      })
      .then((res) => {
        setUser(res.data);
        ToastAndroid.show("Preferences saved!", ToastAndroid.SHORT);
        navigation.reset({
          index: 0,
          routes: [{ name: "App" }],
        });
      })
      .catch((error) => {
        console.error("Error saving preferences:", error);
        ToastAndroid.show("Failed to save preferences", ToastAndroid.SHORT);
      });
  };

  return (
    <ScrollView style={styles.container}>
      {questions.map((question, index) => (
        <View key={index} style={styles.questionContainer}>
          <Text style={styles.questionTitle}>{question.title}</Text>
          <View style={styles.optionsContainer}>
            {question.options.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => updatePreference(question.key, option)}
                style={[
                  styles.optionButton,
                  (question.key === "allergies"
                    ? recipesPreferences.allergies.includes(option)
                    : recipesPreferences[question.key] === option) && {
                    backgroundColor: Colors.Error,
                  },
                ]}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
      <Pressable
        style={[styles.saveButton, { marginBottom: 40 }]}
        onPress={handleSavePreferences}
      >
        <Text style={styles.saveButtonText}>Save Preferences</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.Primary,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.TextPrimary,
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  optionButton: {
    borderColor: Colors.CardBackground,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
    width: "48%", // Adjusts for 2 options per row; change to "23%" for 4 options per row
    alignItems: "center",
    backgroundColor: Colors.CardBackground,
  },
  optionText: {
    fontSize: 16,
    color: Colors.Secondary,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: Colors.Blue,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    color: Colors.Secondary,
  },
});
