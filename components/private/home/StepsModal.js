import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { Colors } from "../../../constants/Colors";

const StepsModal = ({
  isVisible,
  onClose,
  steps,
  isTrackingSteps,
  toggleStepTracking,
}) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <LottieView
            source={require("../../../assets/animations/steps2.json")}
            autoPlay
            loop
            style={styles.animation}
          />
          <Text style={styles.stepsText}>
            {`You've taken ${steps} steps today`}
          </Text>
          <Text style={styles.messageText}>
            {steps < 5000
              ? "Keep moving! A little more effort and you'll hit your goal."
              : "Great job! You're hitting those targets."}
          </Text>

          <TouchableOpacity
            onPress={toggleStepTracking}
            style={styles.trackButton}
          >
            <Text style={styles.trackButtonText}>
              {isTrackingSteps ? "Stop Tracking" : "Start Tracking"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  stepsText: {
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
  trackButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: Colors.Blue,
    borderRadius: 10,
  },
  trackButtonText: {
    color: Colors.Secondary,
    fontSize: 16,
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

export default StepsModal;
