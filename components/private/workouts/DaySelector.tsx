import {Modal, Pressable, Text, View} from 'react-native';
import styles from './workout.styles';

export const DaySelectorModal = ({visible, onSelectDay, onClose}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}>
    <View style={styles.modalBackground}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Select a Day</Text>
        {[
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ].map(day => (
          <Pressable
            key={day}
            style={styles.dayButton}
            onPress={() => onSelectDay(day)}>
            <Text style={styles.dayText}>{day}</Text>
          </Pressable>
        ))}
        <Pressable
          style={[styles.dayButton, styles.closeButton]}
          onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
);
