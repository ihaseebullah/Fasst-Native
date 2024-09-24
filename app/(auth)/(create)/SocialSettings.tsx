// @ts-nocheck
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Colors } from "../../../constants/Colors";
import { Server } from "../../../constants/Configs";
import { UserContext } from "../../../context/UserContext";
import CustomPicker from "../../../components/shared/CustomPicker";
import CustomDialog from "../../../components/shared/CustomDialog";

const UserProfileInputScreen = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("other");
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (user?.SOCIAL_USER) {
      navigation.navigate("Health_Metrics");
    }
  }, []);

  const handleSaveProfile = async () => {
    if (!firstName || !lastName || !username) {
      setDialogMessage("Please fill in all required fields.");
      setDialogVisible(true);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${Server}/api/social/initialize/create-social-profile`,
        {
          firstName,
          lastName,
          bio,
          username,
          gender,
          userId: user._id,
        }
      );

      if (response.status === 201) {
        const updatedUser = response.data;
        setUser(updatedUser);
        setDialogMessage("Profile created successfully!");
        setDialogVisible(true);
        navigation.reset({
          index: 0,
          routes: [{ name: "Health_Metrics" }],
        });
      } else {
        setDialogMessage("Failed to create profile. Please try again.");
        setDialogVisible(true);
      }
    } catch (error) {
      console.error("Error creating social profile:", error);
      const errorMessage =
        error.response?.data?.error || "An error occurred. Please try again.";
      setDialogMessage(errorMessage);
      setDialogVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const genders = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile Information</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor={Colors.TextSecondary}
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor={Colors.TextSecondary}
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={[styles.input, styles.bioInput]}
        placeholder="Bio"
        placeholderTextColor={Colors.TextSecondary}
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={4}
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor={Colors.TextSecondary}
        value={username}
        onChangeText={setUsername}
      />

      {/* Gender Selection */}
      <View style={styles.genderContainer}>
        <CustomPicker
          label="Gender"
          selectedValue={gender}
          onValueChange={setGender}
          items={genders}
        />
      </View>

      <TouchableOpacity onPress={handleSaveProfile} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>
          {loading ? "Saving..." : "Save Profile"}
        </Text>
      </TouchableOpacity>

      {/* Custom Dialog */}
      <CustomDialog
        visible={dialogVisible}
        message={dialogMessage}
        onClose={() => setDialogVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.Primary, // Dark background color
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.Secondary, // Light color for the title
    marginBottom: 20,
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
  bioInput: {
    height: 100, // Increase height for bio input
    textAlignVertical: "top", // Align text at the top
    paddingVertical: 10, // Add vertical padding
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  saveButton: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.Blue, // Accent color for the button
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  saveButtonText: {
    color: Colors.Secondary, // Light text color on the button
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default UserProfileInputScreen;
