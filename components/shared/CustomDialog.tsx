import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors"; // Adjust the path based on your project structure

const CustomDialog = ({ visible, message, onClose }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.dialogContainer}>
          <Text style={styles.messageText}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialogContainer: {
    width: 300,
    padding: 20,
    backgroundColor: Colors.CardBackground, // Using the card background color
    borderRadius: 10,
    borderColor: Colors.CardBorder, // Adding a border to match the card theme
    borderWidth: 1,
    alignItems: "center",
  },
  messageText: {
    fontSize: 16,
    color: Colors.TextPrimary, // Primary text color
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    width: "100%",
    padding: 10,
    backgroundColor: Colors.Blue, // Blue accent color for the button
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.Secondary, // Light color for the button text
    fontSize: 16,
  },
});

export default CustomDialog;
