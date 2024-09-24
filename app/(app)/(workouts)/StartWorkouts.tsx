import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons
import { Picker } from "@react-native-picker/picker";
import { Colors } from "../../../constants/Colors"; // Adjust the path as necessary
import { useNavigation } from "expo-router";

const bodyParts = [
  "back",
  "cardio",
  "chest",
  "lower arms",
  "lower legs",
  "neck",
  "shoulders",
  "upper arms",
  "upper legs",
  "waist",
];

const StartWorkouts = ({
  todaysExercises,
  recommendations,
  randomExercises,
  targets,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState(bodyParts[0]); // Default selection
  const [number, setNumber] = useState(0);
  const [time, setTime] = useState(0);
  const navigation = useNavigation();
  const handleOptionSelect = (option) => {
    if (option === "Random Exercises") {
      navigation.navigate("Play_Workouts", {
        request: option,
        random: randomExercises,
        category: targets,
      });
    } else if (option === "Scheduled Exercises") {
      navigation.navigate("Play_Workouts", {
        request: option,
        exercisesLoaded: todaysExercises,
      });
    } else {
      navigation.navigate("Play_Workouts", {
        request: option,
        recommendations: recommendations,
      });
    }
  };

  const handleRandomSelect = () => {
    setPickerVisible(false); // Close the picker
    navigation.navigate("Play_Workouts", {
      bodyPart: selectedBodyPart,
      number: number,
      time: time,
    });
  };

  return (
    <View style={styles.container}>
      {/* Floating Button */}
      <TouchableOpacity
        style={[styles.floatingButton, { padding: 15 }]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="play" size={20} color={Colors.Secondary} />
      </TouchableOpacity>

      {/* Modal for Options */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Choose an Option</Text>
            {recommendations.length != 0 ? (
              [
                "Scheduled Exercises",
                "Recommended Exercises",
                "Random Exercises",
              ].map((option) => {
                return (
                  <Pressable
                    disabled={recommendations.length === 0 ? true : false}
                    key={option}
                    style={styles.modalButton}
                    onPress={() => handleOptionSelect(option)}
                  >
                    <Text style={styles.modalButtonText}>
                      {recommendations.length != 0 ? option : "Loading..."}
                    </Text>
                  </Pressable>
                );
              })
            ) : (
              <View
                style={{
                  height: 150,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator color={Colors.Error} />
              </View>
            )}
            <Pressable
              style={[styles.modalButton, styles.closeButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal for Picker (Random Selection) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={pickerVisible}
        onRequestClose={() => setPickerVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Body Part</Text>

            {/* Styled TextInput for number of exercises */}
            <TextInput
              onChangeText={setNumber}
              placeholder="Enter the number of exercises"
              style={{
                height: 40,
                marginBottom: 10,
                paddingHorizontal: 10,
                borderRadius: 5,
                color: Colors.Secondary, // Text color
                backgroundColor: Colors.CardBackground, // Background color
              }}
              placeholderTextColor={Colors.TextSecondary} // Placeholder text color
            />

            {/* Styled TextInput for time in seconds */}
            <TextInput
              onChangeText={setTime}
              placeholder="Enter time in seconds"
              style={{
                height: 40,
                marginBottom: 10,
                paddingHorizontal: 10,
                borderRadius: 5,
                color: Colors.Secondary, // Text color
                backgroundColor: Colors.CardBackground, // Background color
              }}
              placeholderTextColor={Colors.TextSecondary} // Placeholder text color
            />

            <Pressable style={styles.modalButton} onPress={handleRandomSelect}>
              <Text style={styles.modalButtonText}>Confirm</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, styles.closeButton]}
              onPress={() => setPickerVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingButton: {
    position: "absolute",
    bottom: 70,
    right: 30,
    backgroundColor: Colors.Blue,
    borderRadius: 30,
    elevation: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: Colors.Primary,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.TextPrimary,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    padding: 10,
    backgroundColor: Colors.CardBackground,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: Colors.Secondary,
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: Colors.Error,
  },
  closeButtonText: {
    color: Colors.Secondary,
    fontSize: 16,
  },
  picker: {
    width: 250,
    backgroundColor: Colors.Primary,
    color: Colors.TextPrimary,
  },
});

export default StartWorkouts;
