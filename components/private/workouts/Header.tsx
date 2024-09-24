import { Text, View } from "react-native";
import styles from "./workout.styles";

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Workouts</Text>
    </View>
  );
}
