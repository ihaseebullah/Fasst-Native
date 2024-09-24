import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { Colors } from "../../../constants/Colors";

const StreakModal = ({ isVisible, onClose, streakDays }) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose} // for Android back button
    >
      <TouchableOpacity
        style={styles.modalContainer}
        activeOpacity={1}
        onPress={onClose} // Close modal when tapping outside
      >
        <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
          <LottieView
            source={require("../../../assets/animations/fire.json")}
            autoPlay
            loop
            style={styles.animation}
          />
          <Text style={styles.streakText}>
            {`You're on a ${streakDays} day streak!`}
          </Text>
          <Text style={styles.messageText}>
            {streakDays < 5
              ? "Keep going, you're doing great!"
              : "Amazing! You're on fire!"}
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
    borderRadius: 20,
    alignItems: "center",
  },
  animation: {
    width: 250,
    height: 250,
  },
  streakText: {
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

export default StreakModal;
