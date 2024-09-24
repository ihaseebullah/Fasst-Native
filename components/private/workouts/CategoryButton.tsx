// CategoryButton.js
import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "../../../components/private/workouts/workout.styles"
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";

const CategoryButton = ({ item, isActive, onPress }) => (
  <TouchableOpacity
    style={[
      styles.categoryButton,
      isActive && styles.activeCategoryButton,
    ]}
    onPress={onPress}
  >
    <Text style={styles.categoryText}>{capitalizeFirstLetter(item)}</Text>
  </TouchableOpacity>
);

export default CategoryButton;
