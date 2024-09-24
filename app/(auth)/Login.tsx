// @ts-nocheck
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ToastAndroid,AsyncStorage
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Colors } from "../../constants/Colors";
import { Server } from "../../constants/Configs";
import { UserContext } from "../../context/UserContext";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        let res = await axios.get(`${Server}/root`);
        if (res.status === 200) {
          navigation.navigate("App");
          await AsyncStorage.setItem(
            "App_Data",
            JSON.stringify({ isLoggedIn: true, user: res.data })
          );
        } else {
          let oldData = await AsyncStorage.getItem("App_Data");
          oldData = JSON.parse(oldData);
          await AsyncStorage.setItem(
            "App_Data",
            JSON.stringify({ ...oldData, isLoggedIn: false })
          );
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLoginStatus();
  }, [navigation]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${Server}/auth/login`, {
        email,
        password,
      });

      if (response.data.token) {
        await AsyncStorage.setItem(
          "App_Data",
          JSON.stringify({
            isLoggedIn: true,
            accountExist: true,
            user: response.data.user,
            token: response.data.token,
          })
        );
        setUser(response.data.user);
        setLoading(false);
        if (!response.data.user.SOCIAL_USER) {
          navigation.reset({
            index: 0,
            routes: [{ name: "Social_Info" }],
          });
        } else if (!response.data.user.HEALTH_MATRICS) {
          navigation.reset({
            index: 0,
            routes: [{ name: "Health_Metrics" }],
          });
        } else if (!response.data.user.GOALS) {
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
      } else {
        ToastAndroid.show(
          "Invalid response from the server",
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      setLoading(false);
      ToastAndroid.show(error.response?.data?.message, ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888" // Darker placeholder text color for dark theme
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888" // Darker placeholder text color for dark theme
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("Forgot_Password")}
        style={styles.forgotPasswordContainer}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.Primary, // Dark background color
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.Secondary, // Light color for the title
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.TextSecondary, // Secondary text color for less emphasis
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.CardBackground, // Darker background for input fields
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: Colors.TextPrimary, // Light text color for input
    marginBottom: 20,
    borderColor: Colors.CardBorder, // Subtle border to distinguish input fields
    borderWidth: 1,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: Colors.TextSecondary, // Secondary text color for less emphasis
    fontSize: 14,
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.Blue, // Light color for the button
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: Colors.Secondary, // Dark text color on light buttons
    fontSize: 18,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    color: Colors.TextSecondary, // Secondary text color for less emphasis
    fontSize: 16,
  },
  signupLink: {
    color: Colors.Blue, // Use blue for actionable text like sign-up links
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default Login;
