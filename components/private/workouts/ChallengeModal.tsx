import { Modal, Pressable, Text, View } from "react-native";
import styles from "./workout.styles";
import { Colors } from "../../../constants/Colors";
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from "lottie-react-native";

export const ChallengeModal = ({
  visible,
  selectedChallenge,
  currentSteps,
  onClose,
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalBackground}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Daily Challenge</Text>
        <Text style={styles.modalDescription}>
          {selectedChallenge ? selectedChallenge.description : ""}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{ color: Colors.Secondary, marginRight: 10, fontSize: 40 }}
          >
            <Ionicons name="trophy-outline" size={30} />{" "}
            {selectedChallenge ? selectedChallenge.steps : 0}
          </Text>
          <Text style={{ color: Colors.Secondary, fontSize: 40 }}>
            <LottieView
              source={require("../../../assets/animations/steps2.json")}
              autoPlay
              loop
              style={{ width: 30, height: 30 }}
            />{" "}
            {currentSteps}
          </Text>
        </View>
        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.actionButton, { backgroundColor: Colors.Error }]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Give Up</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
);
