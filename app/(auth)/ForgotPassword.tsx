import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "../../constants/Colors";
import axios from "axios";
import { Server } from "../../constants/Configs";
import { useNavigation } from "@react-navigation/native";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();

  const handleSendOtp = () => {
    axios
      .post(`${Server}/auth/forgot-password/send-OTP`, { email })
      .then((res) => {
        if (res.status === 200) {
          ToastAndroid.show("OTP sent successfully", ToastAndroid.SHORT);
          setOtpSent(true);
        } else if (res.status === 404) {
          ToastAndroid.show("Failed to send OTP", ToastAndroid.SHORT);
        }
      })
      .catch((err) => {
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
      });
  };

  const handleSubmitOtp = () => {
    axios
      .put(`${Server}/auth/forgot-password/verify-OTP`, { email, OTP: otp })
      .then((res) => {
        if (res.status === 200) {
          ToastAndroid.show("OTP verified successfully", ToastAndroid.SHORT);
          setOtpVerified(true);
        } else if (res.status === 401) {
          ToastAndroid.show("Invalid OTP", ToastAndroid.SHORT);
        }
      });
  };

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      ToastAndroid.show("Passwords do not match", ToastAndroid.SHORT);
      return;
    }
    axios
      .put(`${Server}/auth/forgot-password/reset-password`, {
        email,
        newPassword,
      })
      .then((res) => {
        if (res.status === 200) {
          ToastAndroid.show("Password reset successful", ToastAndroid.SHORT);
          navigation.navigate("Login");
        }
      })
      .catch((err) => {
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>

      {!otpVerified ? (
        <>
          <Text style={styles.subtitle}>
            Enter your email to receive an OTP
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.TextSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          {otpSent && (
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              placeholderTextColor={Colors.TextSecondary}
              keyboardType="default"
              autoCapitalize="none"
              value={otp}
              onChangeText={setOtp}
            />
          )}

          {!otpSent ? (
            <TouchableOpacity
              style={styles.sendOtpButton}
              onPress={handleSendOtp}
            >
              <Text style={styles.buttonText}>Send OTP</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitOtp}
            >
              <Text style={styles.buttonText}>Submit OTP</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>Enter your new password</Text>

          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor={Colors.TextSecondary}
            secureTextEntry
            autoCapitalize="none"
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={Colors.TextSecondary}
            secureTextEntry
            autoCapitalize="none"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleResetPassword}
          >
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.Primary, // Dark background
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.TextPrimary, // Light gray title color
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.TextSecondary, // Secondary text color
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.CardBackground, // Dark gray for input fields
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: Colors.TextPrimary, // Light text for input
    marginBottom: 20,
  },
  sendOtpButton: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.Blue, // Blue button color for sending OTP
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  submitButton: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.Blue, // Blue button color for submitting OTP
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: Colors.Secondary, // White text on buttons
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ForgotPassword;
