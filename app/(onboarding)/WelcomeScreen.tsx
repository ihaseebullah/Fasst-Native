import React, {useContext, useEffect} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors} from '../../constants/Colors';
import {useNavigation} from '@react-navigation/native';
import {UserContext} from '../../context/UserContext';
import {checkUserLogin} from '../../utils/checkUserIsLoggedIn';

export const WelcomeScreen = () => {
  const {top, bottom} = useSafeAreaInsets();
  const navigation = useNavigation();
  const {setAppData, setUser} = useContext(UserContext);

  useEffect(() => {
    setTimeout(() => {
      checkUserLogin(navigation, setAppData, setUser);
    }, 1000);
  }, []);

  return (
    <View style={[styles.container, {paddingTop: top, paddingBottom: bottom}]}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.poweredByContainer}>
        <Text style={styles.poweredByText}>Powered by Star Labs</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Primary,
    justifyContent: 'space-between', // Changed to space-between
    alignItems: 'center',
  },
  imageContainer: {
    marginTop: '40%',
    width: '100%',
    height: 350,
    justifyContent: 'center', // Center logo vertically in the container
    alignItems: 'center', // Center logo horizontally in the container
  },
  logo: {
    width: '100%', // Adjust logo size as needed
    height: '100%', // Adjust logo size as needed
  },
  poweredByContainer: {
    paddingBottom: 20, // Adjust padding as needed
  },
  poweredByText: {
    fontSize: 12,
    color: Colors.TextSecondary,
    textAlign: 'center',
  },
});
