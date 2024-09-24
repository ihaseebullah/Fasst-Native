import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import axios from "axios";
import { UserContext } from "../../../context/UserContext";
import { Colors } from "../../../constants/Colors";
import { useRoute, useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import { Server } from "../../../constants/Configs";
import Icon from "react-native-vector-icons/Ionicons"; // Importing Ionicons from react-native-vector-icons
import DateTimePicker from "@react-native-community/datetimepicker";

const UserProfile = () => {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState({});
  const [fullScreenPost, setFullScreenPost] = useState(null);
  const [profilePicVisible, setProfilePicVisible] = useState(false); // State for profile picture modal
  const [modalVisible, setModalVisible] = useState(false);
  const [requestLocation, setRequestLocation] = useState("");
  const [otherInfo, setOtherInfo] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const route = useRoute();
  const navigation = useNavigation(); // Initialize navigation

  // Assuming the user's ID is passed in the route params
  const { userId } = route.params;

  useEffect(() => {
    // Fetch user data based on userId
    axios
      .get(`${Server}/api/social/get-user/${userId}`)
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [userId]);

  useEffect(() => {
    if (userData._id) {
      axios
        .get(`${Server}/api/social/interactions/getPosts/${userData._id}/`)
        .then((res) => {
          setPosts(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [userData]);

  const handlePostPress = (post) => {
    setFullScreenPost(post);
  };

  const handleRequestMeetup = () => {
    // Call createMeetup endpoint
    axios
      .post(`${Server}/api/social/interactions/meetups`, {
        socialUserId: user.SOCIAL_USER,
        to: userId,
        otherInformation: otherInfo,
        location: requestLocation,
        date: date.toISOString(), // Sending date in ISO format
      })
      .then((response) => {
        console.log("Meetup request sent successfully:", response.data);
        setModalVisible(false); // Close the modal on success
      })
      .catch((err) => {
        console.error("Error sending meetup request:", err);
      });
  };

  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      setShowDatePicker(false);
      setShowTimePicker(true); // Show time picker after selecting date
    } else {
      setShowDatePicker(false); // Close date picker if cancelled
    }
  };

  const onTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
      setShowTimePicker(false); // Close time picker after selecting time
    } else {
      setShowTimePicker(false); // Close time picker if cancelled
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Social")}>
        <Icon name="arrow-back" size={24} color={Colors.TextPrimary} />
      </TouchableOpacity>

      <ScrollView>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={() => setProfilePicVisible(true)}>
            <Image
              source={{ uri: userData.profilePic }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <View style={styles.profileStats}>
            <Text style={styles.fullName}>
              {`${userData.firstName} ${userData.lastName}`}
            </Text>
            <Text style={styles.bio}>@{userData.username}</Text>
            <Text style={styles.bio}>{userData.bio}</Text>
          </View>
        </View>

        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.media.image}
              style={styles.post}
              onPress={() => handlePostPress(item)}
            >
              <Image
                source={{ uri: item.media.image }}
                style={styles.postImage}
              />
            </TouchableOpacity>
          )}
          numColumns={3}
          scrollEnabled={false}
        />
      </ScrollView>

      {/* Floating Request Meetup Button */}
      <TouchableOpacity
        style={styles.requestButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.requestButtonText}>Request Meetup</Text>
      </TouchableOpacity>

      {/* Full-Screen Post View Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={!!fullScreenPost}
        onRequestClose={() => setFullScreenPost(null)}
      >
        <TouchableOpacity
          style={styles.fullScreenModal}
          activeOpacity={1}
          onPress={() => setFullScreenPost(null)}
        >
          {fullScreenPost && (
            <>
              <Image
                source={{ uri: fullScreenPost.media.image }}
                style={styles.fullScreenImage}
              />
              <View style={styles.fullScreenCaption}>
                <Text style={styles.fullScreenCaptionText}>
                  {fullScreenPost.media.caption}
                </Text>
              </View>
            </>
          )}
        </TouchableOpacity>
      </Modal>

      {/* Full-Screen Profile Picture Modal with ScrollView */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={profilePicVisible}
        onRequestClose={() => setProfilePicVisible(false)}
      >
        <ScrollView
          style={styles.fullScreenModal}
          maximumZoomScale={5}
          minimumZoomScale={1}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setProfilePicVisible(false)}
          >
            <Image
              source={{ uri: userData.profilePic }}
              style={styles.fullScreenImage}
            />
          </TouchableOpacity>
        </ScrollView>
      </Modal>

      {/* Request Meetup Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Request Meetup</Text>
            <TextInput
              style={[styles.input, { backgroundColor: Colors.Primary }]}
              placeholder="Enter Location"
              value={requestLocation}
              onChangeText={setRequestLocation}
              placeholderTextColor={Colors.TextSecondary}
            />
            <TextInput
              style={[styles.input, { backgroundColor: Colors.Primary }]}
              placeholder="Other Information"
              value={otherInfo}
              onChangeText={setOtherInfo}
              placeholderTextColor={Colors.TextSecondary}
            />
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerText}>
                {`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
            {showTimePicker && (
              <DateTimePicker
                value={date}
                mode="time"
                display="default"
                onChange={onTimeChange}
              />
            )}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  {
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: Colors.Error,
                  },
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Icon name="close" size={24} color={Colors.Error} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: Colors.Blue }]}
                onPress={handleRequestMeetup}
              >
                <Icon name="send" size={24} color={Colors.Secondary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Primary,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: Colors.CardBackground,
    borderRadius: 20,
    padding: 10,
  },
  profileSection: {
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
    marginTop: 60, // Add margin to avoid overlap with back button
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileStats: {
    alignItems: "center",
    marginTop: 10,
  },
  fullName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.TextPrimary,
  },
  bio: {
    fontSize: 14,
    color: Colors.TextSecondary,
    marginTop: 5,
    textAlign: "center",
  },
  post: {
    width: "33.33%",
    aspectRatio: 1,
    padding: 1,
  },
  postImage: {
    flex: 1,
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  fullScreenCaption: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  fullScreenCaptionText: {
    color: Colors.TextPrimary,
    fontSize: 16,
    textAlign: "center",
  },
  requestButton: {
    position: "absolute",
    bottom: 90,
    left: "15%",
    right: "15%",
    backgroundColor: Colors.Blue,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  requestButtonText: {
    color: Colors.Secondary,
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: Colors.CardBackground,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.TextPrimary,
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.CardBorder,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    color: Colors.TextPrimary,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  iconButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  datePickerButton: {
    backgroundColor: Colors.Primary,
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: "center",
  },
  datePickerText: {
    color: Colors.TextPrimary,
    fontSize: 16,
  },
});

export default UserProfile;
