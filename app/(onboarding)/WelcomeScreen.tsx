import React, { useContext, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../../context/UserContext";
import { checkUserLogin } from "../../utils/checkUserIsLoggedIn";

export const WelcomeScreen = () => {
  const { top, bottom } = useSafeAreaInsets();
  const navigation = useNavigation();
  const { setAppData, setUser } = useContext(UserContext);

  useEffect(() => {
    setTimeout(() => {
      checkUserLogin(navigation, setAppData, setUser);
    }, 1000);
  }, []);

  return (
    <View
      style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Primary, // Updated for dark theme
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: 350,
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 200,
  },
  logo: {
    width: "80%", // Adjust the width of the logo
    height: "80%", // Adjust the height of the logo
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

