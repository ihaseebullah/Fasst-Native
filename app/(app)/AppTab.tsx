import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import {useNavigation} from '@react-navigation/native';
import {View, TouchableOpacity} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import HomeScreen from './(home)/HomeScreen';
import Calories from './(calories)/Calories';
import Workouts from './(workouts)/Workouts';
import Social from './(social)/Social';
import FoodDetails from './(calories)/FoodDetails';
import {Colors} from '../../constants/Colors';
import PlayWorkouts from './(workouts)/PlayWorkouts';
import Marketplace from './(marketplace)/Marketplace';
import TopTab from './(social)/TopTab';
import UserProfile from './(social)/UserProfile';
import NotificationScreen from './(home)/NotificationScreen';

const Tab = createBottomTabNavigator();
const tintColorLight = '#0a7ea4';

const BackButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{paddingLeft: 15}}>
      <Icon name="keyboard-backspace" size={24} color={Colors.Secondary} />
    </TouchableOpacity>
  );
};

const AppTabs = () => {
  return (
    <SafeAreaProvider>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({color, size, focused}) => {
            let iconName;

            if (route.name === 'Home_Screen') {
              iconName = 'home';
            } else if (route.name === 'Calories') {
              iconName = 'cards-heart-outline';
            } else if (route.name === 'Social') {
              iconName = 'account-circle-outline';
            } else if (route.name === 'Workouts') {
              iconName = 'human-handsup';
            } else if (route.name === 'Marketplace') {
              iconName = 'storefront';
            }

            // For the middle icon (e.g., Social), apply special styling
            if (route.name === 'Social') {
              return (
                <View
                  style={{
                    width: 70,
                    height: 70,
                    backgroundColor: Colors.Blue,
                    borderRadius: 35,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    top: -30,
                    shadowColor: '#000',
                    shadowOpacity: 0.3,
                    shadowOffset: {width: 0, height: 5},
                    shadowRadius: 10,
                    elevation: 10,
                  }}>
                  <Icon
                    name={iconName}
                    size={focused ? 34 : 30}
                    color={'white'}
                  />
                </View>
              );
            }

            return (
              <Icon
                name={iconName}
                size={focused ? 30 : 26}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: Colors.Blue,
          tabBarInactiveTintColor: Colors.Secondary,
          tabBarStyle: {
            backgroundColor: '#000000',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            height: 70,
            position: 'absolute',
            elevation: 10, // Elevation for Android
            shadowColor: '#000',
            shadowOpacity: 0.3, // Shadow for iOS
            shadowOffset: {width: 0, height: 5},
            shadowRadius: 15,
            paddingBottom: 15,
            paddingTop: 15,
            borderTopWidth: 0, // Removes the border line
          },
          tabBarShowLabel: false, // Remove the labels
          tabBarIconStyle: {
            marginBottom: 0,
          },
          headerLeft: () => <BackButton />,
          headerStyle: {
            backgroundColor: Colors.Primary,
            height: 60, // Adjusts header height if necessary
          },
          headerStatusBarHeight: 0,
          headerTintColor: Colors.Secondary,
        })}>
        <Tab.Screen
          options={{
            headerShown: false,
          }}
          name="Home_Screen"
          component={HomeScreen}
        />
        <Tab.Screen
          options={{
            headerShown: false,
          }}
          name="Calories"
          component={Calories}
        />
        <Tab.Screen
          options={{
            headerShown: false,
          }}
          name="Social"
          component={TopTab}
        />
        <Tab.Screen
          options={{
            headerShown: false,
          }}
          name="Workouts"
          component={Workouts}
        />
        <Tab.Screen
          options={{
            headerShown: false,
          }}
          name="Marketplace"
          component={Marketplace}
        />
        <Tab.Screen
          options={{
            headerShown: true, // Show header to display back button
            tabBarButton: () => null,
            title: 'Food Details',
          }}
          name="Food_Details"
          component={FoodDetails}
        />
        <Tab.Screen
          options={{
            headerShown: true, // Show header to display back button
            tabBarButton: () => null,
            title: 'Start Workouts',
          }}
          name="Play_Workouts"
          component={PlayWorkouts}
        />
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarButton: () => null,
          }}
          name="User_Profile"
          component={UserProfile}
        />
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarButton: () => null,
          }}
          name="Notification_Screen"
          component={NotificationScreen}
        />
      </Tab.Navigator>
    </SafeAreaProvider>
  );
};

export default AppTabs;
