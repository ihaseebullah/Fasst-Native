import React, {useContext, useEffect} from 'react';
import {View, StyleSheet, ActivityIndicator, Image, Text} from 'react-native';
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
        {/* Adding the powered by Star Labs text */}
      </View>
      <View style={{flex: 1, alignItems: 'baseline', justifyContent: 'center'}}>
        <Text style={styles.poweredByText}>Powered by Star Labs</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Primary, // Updated for dark theme
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 350,
    borderRadius: 15,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 200,
  },
  logo: {
    width: '80%', // Adjust the width of the logo
    height: '80%', // Adjust the height of the logo
  },
  poweredByText: {
    marginTop: 20, // Adjust the space between the logo and the text
    fontSize: 12, // Font size for the text
    color: Colors.TextSecondary, // Adjust the color as needed
    textAlign: 'center',
  },
});
