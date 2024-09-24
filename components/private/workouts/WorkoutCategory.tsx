import { FlatList } from "react-native";
import CategoryButton from "./CategoryButton";
import styles from "./workout.styles";

export const WorkoutCategorySelector = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => (
  <FlatList
    data={categories}
    renderItem={({ item }) => (
      <CategoryButton
        item={item}
        isActive={selectedCategory === item}
        onPress={() => onSelectCategory(item)}
      />
    )}
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.categorySelector}
    keyExtractor={(item) => item}
  />
);
