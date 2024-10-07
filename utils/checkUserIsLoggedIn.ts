import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Server } from "../constants/Configs";
import { ToastAndroid } from "react-native";

export const checkUserLogin = async (navigation, setAppData, setUser) => {
  try {
    const response = await axios.get(`${Server}/root`);
    if (response.status === 200 && response.data) {
      const userData = response.data;
      await AsyncStorage.setItem("App_Data", JSON.stringify(userData));
      setAppData(userData);
      setUser(userData);

      // Correctly check if HEALTH_METRICS is present and valid
      const healthMetrics = userData.HEALTH_MATRICS;

      if (!userData.SOCIAL_USER) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Social_Info" }],
        });
      } else if (
        !healthMetrics || // Checks if healthMetrics is undefined or null
        healthMetrics === "" || // Checks if healthMetrics is an empty string
        (typeof healthMetrics === "object" && !healthMetrics.$oid) || // Checks if healthMetrics is an object but doesn't have an $oid
        (typeof healthMetrics === "object" &&
          healthMetrics.$oid === undefined) || // Additional check for missing $oid key
        (typeof healthMetrics === "object" &&
          Object.keys(healthMetrics).length === 0) // Checks if healthMetrics is an empty object
      ) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Social_Info" }],
        });
      } else if (response.data.GOALS.length === 0) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Goal_Screen" }],
        });
      } else {
        // At this point, HEALTH_METRICS is considered valid
        navigation.reset({
          index: 0,
          routes: [{ name: "App" }],
        });
      }
    } else {
      navigation.navigate("Onboarding_Workouts");
    }
  } catch (error) {
    // ToastAndroid.show(error.response?.data?.message, ToastAndroid.SHORT);
    navigation.navigate("Onboarding_Workouts");
  }
};
