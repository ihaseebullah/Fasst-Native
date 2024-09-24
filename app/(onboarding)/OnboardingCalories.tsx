import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import DumbbellSvg from "../../assets/svg/DumbbellSvg";
import NextScreen from "../../components/shared/NextScreen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../../constants/Colors";
import SvgOnBoardingCalories from "../../assets/svg/Onboarding_Calories";
const OnboardingCalories = () => {
  const { top, bottom } = useSafeAreaInsets();
  return (
    <View style={[styles.container, { marginBottom: bottom }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.topSection}>
          <View style={styles.svgContainer}>
            <SvgOnBoardingCalories />
          </View>
        </View>
        <View style={styles.middleSection}>
          <Text style={styles.title}>Calories</Text>
          <Text style={styles.infoText}>
            Easily track your daily calories to stay on top of your nutrition.
          </Text>
        </View>
      </ScrollView>
      <View style={styles.bottomSection}>
        <NextScreen to={"Onboarding_Marketplace"} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Primary,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  topSection: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  svgContainer: {
    marginTop: 100,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 250,
  },
  middleSection: {
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: Colors.Secondary,
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  infoText: {
    color: Colors.Secondary,
    fontSize: 16,
    textAlign: "center", // Change from "center" to "justify"
    marginVertical: 20,
  },
  bottomSection: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
});
export default OnboardingCalories;
