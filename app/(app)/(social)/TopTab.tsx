import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Colors} from '../../../constants/Colors';
import SocialScreen from './Social';
import ColabScreen from './ColabScreen';
import Meetups from './Meetups';

const TabBar = createMaterialTopTabNavigator();

const TopTab = () => {
  return (
    <TabBar.Navigator
      initialRouteName="Profile"
      screenOptions={{
        tabBarActiveTintColor: Colors.Blue,
        tabBarInactiveTintColor: Colors.TextSecondary,
        tabBarStyle: {backgroundColor: Colors.Primary},
        tabBarIndicatorStyle: {backgroundColor: Colors.Blue},
      }}>
      <TabBar.Screen
        key={'profileTab'}
        name="Profile"
        component={SocialScreen}
      />
      <TabBar.Screen key={'colabTab'} name="Colab" component={ColabScreen} />
      <TabBar.Screen key={'meetupsTab'} name="Meetups" component={Meetups} />
    </TabBar.Navigator>
  );
};

export default TopTab;
