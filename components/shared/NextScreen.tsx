// @ts-nocheck
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../../constants/Colors';

const NextScreen = ({to}: {to: string}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button]}
        onPress={() => navigation.navigate(to)}>
        <Icon name="chevron-right" size={20} color={Colors.Primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.Secondary, // Choose your desired color
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});

export default NextScreen;
