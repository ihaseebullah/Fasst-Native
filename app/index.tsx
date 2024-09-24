import React, {useContext, useState} from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import DetailsScreen from './(onboarding)/DetailsScreen';
import Register from './(auth)/(create)/Register';
import Login from './(auth)/Login';
import {UserContext, UserContextProvider} from '../context/UserContext';
import OnboardingWorkout from './(onboarding)/OnboardingWorkout';
import OnboardingCalories from './(onboarding)/OnboardingCalories';
import OnboardingMarketplace from './(onboarding)/OnboardingMarketplace';
import ForgotPassword from './(auth)/ForgotPassword';
import HealthMetrics from './(auth)/(create)/HealthMetrics';
import {User} from '../Types/User';
import AppTabs from './(app)/AppTab';
import Goal_Screen from './(auth)/(create)/GoalScreen';
import DietaryPreferencesScreen from './(auth)/(create)/DietaryPreferencesScreen';
import UserProfileInputScreen from './(auth)/(create)/SocialSettings';
import {WelcomeScreen} from './(onboarding)/WelcomeScreen';
import {NavigationContainer} from '@react-navigation/native';

const Stack = createStackNavigator();

function App() {
  const userContext = useContext(UserContext);
  const [appData, setAppData] = useState<{
    accountExist: Boolean;
    isLoggedIn: Boolean;
    user: User;
  }>();

  if (!userContext) {
    throw new Error('App must be used within a UserContextProvider');
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{...TransitionPresets.SlideFromRightIOS}}
        initialRouteName={'Welcome_Screen'}>
        <Stack.Screen
          options={{headerShown: false}}
          name="Welcome_Screen"
          component={WelcomeScreen}
        />
        {/* Onboarding screens */}
        <Stack.Screen
          options={{headerShown: false}}
          name="Onboarding_Workouts"
          component={OnboardingWorkout}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Onboarding_Calories"
          component={OnboardingCalories}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Onboarding_Marketplace"
          component={OnboardingMarketplace}
        />
        {/* Auth screens */}
        <Stack.Screen
          options={{headerShown: false}}
          name="Register"
          component={Register}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Health_Metrics"
          component={HealthMetrics}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Goal_Screen"
          component={Goal_Screen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Login"
          component={Login}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Forgot_Password"
          component={ForgotPassword}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Diet_Screen"
          component={DietaryPreferencesScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Social_Info"
          component={UserProfileInputScreen}
        />
        {/* Use tab navigation inside the stack */}
        <Stack.Screen
          options={{headerShown: false}}
          name="App"
          component={AppTabs}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export const Index = () => {
  return (
    <UserContextProvider>
      <App />
    </UserContextProvider>
  );
};
