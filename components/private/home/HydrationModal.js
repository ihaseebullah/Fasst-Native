import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { Colors } from "../../../constants/Colors";

const HydrationModal = ({ isVisible, onClose, hydrationGoal }) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <TouchableOpacity
        style={styles.modalContainer}
        activeOpacity={1}
        onPress={onClose} // Close modal when tapping outside
      >
        <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
          <LottieView
            source={require("../../../assets/animations/hydration.json")}
            autoPlay
            loop
            style={styles.animation}
          />
          <Text style={styles.hydrationText}>
            {`Hydration Goal: ${hydrationGoal} L`}
          </Text>
          <Text style={styles.messageText}>
            {"Stay hydrated! Make sure you're drinking enough water daily."}
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
  hydrationText: {
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

export default HydrationModal;
