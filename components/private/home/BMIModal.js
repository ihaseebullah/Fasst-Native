import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { Colors } from "../../../constants/Colors";

const BMIModal = ({ isVisible, onClose, bmi }) => {
  const getBmiMessage = (bmi) => {
    if (bmi < 18.5)
      return "You're underweight. Consider eating more balanced meals.";
    if (bmi >= 18.5 && bmi < 24.9)
      return "You have a healthy weight. Keep up the good work!";
    if (bmi >= 25 && bmi < 29.9)
      return "You're overweight. Try incorporating more exercise into your routine.";
    return "You're obese. It's important to take steps towards a healthier lifestyle.";
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <TouchableOpacity
        style={styles.modalContainer}
        activeOpacity={1}
        onPress={onClose} // Close modal when tapping outside
      >
        <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
          <LottieView
            source={require("../../../assets/animations/BMI.json")}
            autoPlay
            loop
            style={styles.animation}
          />
          <Text style={styles.bmiText}>{`Your BMI is ${bmi.toFixed(1)}`}</Text>
          <Text style={styles.messageText}>{getBmiMessage(bmi)}</Text>
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
  bmiText: {
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

export default BMIModal;
