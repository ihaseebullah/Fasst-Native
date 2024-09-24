import { Colors } from "../../../constants/Colors";
import  Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";

const FoodCard = ({ name, calories, image, foodObject }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const handleCardPress = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity activeOpacity={1} onPress={handleCardPress}>
        <View style={styles.foodCard}>
          <Image source={{ uri: image }} style={styles.foodImage} />
          <View style={styles.foodInfo}>
            <Text style={styles.foodName}>{name}</Text>
            <Text style={styles.foodCalories}>
              <Ionicons
                name="crosshairs-gps"
                size={13}
                color={Colors.Secondary}
              />
              {" " + calories}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Modal for displaying food details */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>{foodObject.Recipe_name}</Text>
            <Text style={styles.subtitle}>{foodObject.Cuisine_type}</Text>

            {/* Nutrient Information Section */}
            <ScrollView>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  <Ionicons
                    name="nutrition"
                    size={20}
                    color={Colors.Secondary}
                  />{" "}
                  Nutrient Information
                </Text>
                <Text style={styles.item}>
                  <Ionicons
                    name="fire"
                    size={16}
                    color={Colors.Secondary}
                  />{" "}
                  Protein: {foodObject["Protein(g)"]} g
                </Text>
                <Text style={styles.item}>
                  <Ionicons
                    name="pizza"
                    size={16}
                    color={Colors.Secondary}
                  />{" "}
                  Carbs: {foodObject["Carbs(g)"]} g
                </Text>
                <Text style={styles.item}>
                  <Ionicons
                    name="water-outline"
                    size={16}
                    color={Colors.Secondary}
                  />{" "}
                  Fat: {foodObject["Fat(g)"]} g
                </Text>
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Ionicons
                name="close-circle-outline"
                size={24}
                color={Colors.Secondary}
              />
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  foodCard: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.CardBackground, // Dark background for the card
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    shadowColor: Colors.CardBackground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    margin: 10,
    width: 190, // Fixed width for the card to control layout
    height:190
  },
  foodImage: {
    width: 120,
    height: 120,
    borderRadius: 100, // Perfectly circular image
    marginBottom: 10, // Space between image and text
  },
  foodInfo: {
    alignItems: "center", // Center-align text in the card
  },
  foodName: {
    fontSize: 16,
    color: Colors.Secondary, // Light text color for visibility
    textAlign: "center", // Center align the text for consistency
  },
  foodCalories: {
    fontSize: 14,
    color: Colors.TextSecondary, // Use defined secondary text color
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.Primary,
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    width: "90%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.Secondary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.TextSecondary,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.Secondary,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  item: {
    fontSize: 16,
    color: Colors.TextPrimary,
    marginBottom: 5,
  },
  closeButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: Colors.CardBackground,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: Colors.Secondary,
    marginLeft: 5,
  },
});

export default FoodCard;
