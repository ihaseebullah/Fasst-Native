import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  RefreshControl,
  ScrollView,
} from "react-native";
import { UserContext } from "../../../context/UserContext";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import Ionicons
import { Colors } from "../../../constants/Colors"; // Import Colors
import axios from "axios";
import { Server } from "../../../constants/Configs";
import { categorizeMeetups } from "../../../utils/MeetupsSorting";

const Meetups = () => {
  const { user } = useContext(UserContext);
  const [meetupRequests, setMeetupRequests] = useState([]);
  const [upcomingMeetups, setUpcomingMeetups] = useState([]);
  const [pastMeetups, setPastMeetups] = useState([]);
  const [selectedMeetup, setSelectedMeetup] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // State to manage refreshing
  const [meetupStatus, setMeetupStatus] = useState(true);

  useEffect(() => {
    fetchMeetups(); // Fetch meetups on component mount
  }, [meetupStatus]);

  const fetchMeetups = () => {
    axios
      .get(`${Server}/api/social/interactions/meetups/${user.SOCIAL_USER}/`)
      .then((res) => {
        const sortedMeetups = categorizeMeetups(res.data);
        setMeetupRequests(sortedMeetups.pendingMeetups);
        setUpcomingMeetups(sortedMeetups.acceptedMeetups);
        setPastMeetups(sortedMeetups.completedMeetups);
      })
      .catch((err) => console.error(err))
      .finally(() => setRefreshing(false)); // End refreshing state
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMeetups(); // Fetch latest meetups when refresh is triggered
  };

  const renderMeetupItem = ({ item, isRequest }) => (
    <TouchableOpacity onPress={() => handleMeetupClick(item, isRequest)}>
      <View style={styles.meetupCard}>
        <View style={styles.meetupCardHeader}>
          <Ionicons
            name={
              item.status === "pending"
                ? "hourglass-outline"
                : item.status === "accepted"
                ? "checkmark-circle-outline"
                : item.status === "declined"
                ? "close-circle-outline"
                : "checkmark-done-outline"
            }
            size={20}
            color={Colors.TintColorDark}
            style={styles.meetupStatusIcon}
          />
          <Text style={styles.meetupTitle}>{"Meetup at " + item.location}</Text>
        </View>
        <Text style={styles.meetupDate}>{item.otherInformation}</Text>
        <Text style={styles.meetupDate}>
          {new Date(item.date).toLocaleDateString()} at{" "}
          {new Date(item.date).toLocaleTimeString()}
        </Text>
        <Text style={styles.meetupLocation}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleMeetupClick = (meetup, isRequest) => {
    if (isRequest && meetup.to === user.SOCIAL_USER) {
      setSelectedMeetup(meetup);
      setModalVisible(true);
    }
  };

  const handleAcceptMeetup = () => {
    axios
      .put(
        `${Server}/api/social/meetups/status/${selectedMeetup._id}/accepted/`
      )
      .then(() => {
        setMeetupStatus(!meetupStatus);
        setModalVisible(false);
      })
      .catch((err) => console.error(err));
  };

  const handleRejectMeetup = () => {
    axios
      .put(
        `${Server}/api/social/meetups/status/${selectedMeetup._id}/declined/`
      )
      .then(() => {
        setMeetupStatus(!meetupStatus);
        setModalVisible(false);
      })
      .catch((err) => console.error(err));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.TintColorDark]}
            tintColor={Colors.TintColorDark}
          />
        }
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="notifications-outline"
              size={20}
              color={Colors.TintColorDark}
            />
            <Text style={styles.sectionTitle}>Meetup Requests</Text>
          </View>
          <FlatList
            data={meetupRequests}
            renderItem={({ item }) =>
              renderMeetupItem({ item, isRequest: true })
            }
            keyExtractor={(item) => item._id.$oid}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No Meetup Requests</Text>
            }
            scrollEnabled={false} // Disable scrolling to enable full ScrollView control
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={Colors.TintColorDark}
            />
            <Text style={styles.sectionTitle}>Upcoming Meetups</Text>
          </View>
          <FlatList
            data={upcomingMeetups}
            renderItem={({ item }) =>
              renderMeetupItem({ item, isRequest: false })
            }
            keyExtractor={(item) => item._id.$oid}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No Upcoming Meetups</Text>
            }
            scrollEnabled={false} // Disable scrolling to enable full ScrollView control
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="time-outline"
              size={20}
              color={Colors.TintColorDark}
            />
            <Text style={styles.sectionTitle}>Past Meetups</Text>
          </View>
          <FlatList
            data={pastMeetups}
            renderItem={({ item }) =>
              renderMeetupItem({ item, isRequest: false })
            }
            keyExtractor={(item) => item._id}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No Past Meetups</Text>
            }
            scrollEnabled={false} // Disable scrolling to enable full ScrollView control
          />
        </View>
      </ScrollView>

      {/* Meetup Details Modal */}
      {selectedMeetup && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Meetup Details</Text>
              <Text style={styles.modalText}>
                Location: {selectedMeetup.location}
              </Text>
              <Text style={styles.modalText}>
                Date:{" "}
                {new Date(selectedMeetup.date).toLocaleString().split(",")[0]}
              </Text>
              <Text style={styles.modalText}>
                Time:{" "}
                {new Date(selectedMeetup.date).toLocaleString().split(",")[1]}
              </Text>
              <Text style={styles.modalText}>
                Info: {selectedMeetup.otherInformation}
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={handleAcceptMeetup}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color={Colors.Secondary}
                  />
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={handleRejectMeetup}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={20}
                    color={Colors.Secondary}
                  />
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Primary,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    color: Colors.TextPrimary,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  meetupCard: {
    backgroundColor: Colors.CardBackground,
    borderColor: Colors.CardBorder,
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  meetupCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  meetupTitle: {
    color: Colors.TextPrimary,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  meetupStatusIcon: {
    marginRight: 5,
  },
  meetupDate: {
    color: Colors.TextSecondary,
    fontSize: 14,
    marginTop: 5,
  },
  meetupLocation: {
    color: Colors.TextSecondary,
    fontSize: 14,
    marginTop: 5,
  },
  emptyText: {
    color: Colors.TextSecondary,
    textAlign: "center",
    marginTop: 10,
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
  modalText: {
    color: Colors.TextPrimary,
    fontSize: 16,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  acceptButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.Success,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    justifyContent: "center",
    marginRight: 5,
  },
  rejectButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.Error,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    justifyContent: "center",
    marginLeft: 5,
  },
  buttonText: {
    color: Colors.Secondary,
    fontSize: 16,
    marginLeft: 5,
  },
});

export default Meetups;
