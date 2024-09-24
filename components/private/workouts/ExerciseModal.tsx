// ExerciseModal.js
import React from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "../../../constants/Colors";

import styles from "../../../components/private/workouts/workout.styles";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";

const ExerciseModal = ({
  visible,
  exercise,
  onClose,
  onSchedule,
  scheduled,
  onPlayExercises,
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalBackground}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>
          {capitalizeFirstLetter(exercise.name)}
        </Text>
        <Image source={{ uri: exercise.gifUrl }} style={styles.modalImage} />
        <Text style={styles.modalText}>Target: {exercise.target}</Text>
        <Text style={styles.modalText}>Equipment: {exercise.equipment}</Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            disabled={scheduled}
            style={styles.optionButton}
            onPress={onSchedule}
          >
            <Icon
              name="calendar"
              size={24}
              color={!scheduled ? Colors.TextPrimary : Colors.Error}
            />
            <Text
              style={[
                styles.optionText,
                { color: !scheduled ? Colors.TextPrimary : Colors.Error },
              ]}
            >
              {scheduled ? "Scheduled" : "Schedule"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              onPlayExercises(
                exercise,
                scheduled ? "Scheduled Exercises" : "random"
              );
            }}
          >
            <Icon name="play-circle-outline" size={24} color={Colors.TextPrimary} />
            <Text style={styles.optionText}>Play</Text>
          </TouchableOpacity>
        </View>

        <Pressable
          style={[styles.dayButton, styles.closeButton]}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
);

export default ExerciseModal;
