import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { Colors } from "../../../constants/Colors";

const WorkoutModal = ({ isVisible, onClose, workouts }) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <TouchableOpacity
        style={styles.modalContainer}
        activeOpacity={1}
        onPress={onClose} // Close modal when tapping outside
      >
        <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
          <LottieView
            source={require("../../../assets/animations/workout.json")}
            autoPlay
            loop
            style={styles.animation}
          />
          <Text style={styles.workoutText}>
            {`You've completed ${workouts} workouts`}
          </Text>
          <Text style={styles.messageText}>
            {workouts < 5
              ? "Keep it up! Consistency is key."
              : "Awesome! You're making great progress."}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: Colors.Primary,
    borderRadius: 10,
    alignItems: "center",
  },
  animation: {
    width: 250,
    height: 250,
  },
  workoutText: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.Secondary,
    marginVertical: 10,
  },
  messageText: {
    fontSize: 16,
    color: Colors.Secondary,
    textAlign: "center",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: Colors.Blue,
    borderRadius: 10,
  },
  closeButtonText: {
    color: Colors.Secondary,
    fontSize: 16,
  },
});

export default WorkoutModal;
