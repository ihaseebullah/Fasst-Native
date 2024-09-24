import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { Colors } from "../../constants/Colors";
import Icon from "react-native-vector-icons/Ionicons";

const CustomPicker = ({ label, selectedValue, onValueChange, items }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (value) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.picker}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectedText}>
          {items.find((item) => item.value === selectedValue)?.label}
        </Text>
        <Icon name="chevron-down" size={24} color={Colors.Secondary} />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text style={styles.itemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: Colors.TextPrimary,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: Colors.CardBackground,
    borderRadius: 8,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedText: {
    color: Colors.TextPrimary,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: Colors.CardBackground,
    borderRadius: 10,
    padding: 20,
  },
  item: {
    paddingVertical: 15,
    borderBottomColor: Colors.CardBorder,
    borderBottomWidth: 1,
  },
  itemText: {
    color: Colors.TextPrimary,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    alignItems: "center",
  },
  closeButtonText: {
    color: Colors.Blue,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomPicker;
