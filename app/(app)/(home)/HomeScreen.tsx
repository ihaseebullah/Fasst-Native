import React, {useContext, useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors} from '../../../constants/Colors';
import {UserContext} from '../../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import StreakModal from '../../../components/private/home/StreakModal';
import BMIModal from '../../../components/private/home/BMIModal';
import AgeModal from '../../../components/private/home/AgeModal';
import HydrationModal from '../../../components/private/home/HydrationModal';
import StepsModal from '../../../components/private/home/StepsModal';
import WorkoutModal from '../../../components/private/home/WorkoutModal';
import Pedometer from 'react-native-pedometer';
import {Server} from '../../../constants/Configs';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = () => {
  const {top, bottom} = useSafeAreaInsets();
  const {user, setSocialUser, setUser} = useContext(UserContext);
  const navigation = useNavigation();
  const [insights, setInsights] = useState(null);
  const [socialUser, setLocalSocialUser] = useState(null);
  const [offline, setOffline] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Modals visibility states
  const [isStreakModalVisible, setStreakModalVisible] = useState(false);
  const [isBMIModalVisible, setBMIModalVisible] = useState(false);
  const [isAgeModalVisible, setAgeModalVisible] = useState(false);
  const [isHydrationModalVisible, setHydrationModalVisible] = useState(false);
  const [isStepsModalVisible, setStepsModalVisible] = useState(false);
  const [isWorkoutModalVisible, setWorkoutModalVisible] = useState(false);

  // Step tracking state
  const [isTrackingSteps, setIsTrackingSteps] = useState(false);
  const [currentSteps, setCurrentSteps] = useState(0);
  const [pedometerSubscription, setPedometerSubscription] = useState(null);
  const [olderStepsCount, setOlderStepsCount] = useState(0);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  useEffect(() => {
    if (isTrackingSteps) {
      startStepCounting();
    } else if (pedometerSubscription) {
      stopStepCounting();
    }
  }, [isTrackingSteps]);

  const fetchInsights = async () => {
    try {
      const response = await axios.get(`${Server}/api/insights/${user._id}/`);
      setSocialUser(response.data.socialUser);
      setLocalSocialUser(response.data.socialUser);
      setInsights(response.data.insights);
      setCurrentSteps(response.data.insights.steps.totalSteps);
      console.log(response.data);
      // Store data locally
      await AsyncStorage.setItem(
        'socialUser',
        JSON.stringify(response.data.socialUser),
      );
      await AsyncStorage.setItem(
        'insights',
        JSON.stringify(response.data.insights),
      );

      setOffline(false); // Set offline to false as we fetched data successfully
    } catch (error) {
      console.log('Error fetching insights:', error);

      setOffline(true); // Set offline if error occurs

      const storedSocialUser = await AsyncStorage.getItem('socialUser');
      const storedInsights = await AsyncStorage.getItem('insights');

      if (storedSocialUser) setLocalSocialUser(JSON.parse(storedSocialUser));
      if (storedInsights) setInsights(JSON.parse(storedInsights));
    }
  };

  const startStepCounting = async () => {
    // Check if the Pedometer is available
    const isPedometerAvailable = await Pedometer.isAvailableAsync();
    if (!isPedometerAvailable) {
      Alert.alert('Error', 'Pedometer not available on this device.');
      return;
    }

    // Request permission on Android
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
        {
          title: 'Activity Recognition Permission',
          message: 'This app needs access to your activity to track steps.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          'Permission required',
          'Activity recognition permission is required to track steps.',
        );
        return;
      }
    }

    // Start watching step count
    const subscription = Pedometer.watchStepCount(result => {
      setCurrentSteps(result.steps);
    });

    setPedometerSubscription(subscription);
  };

  const stopStepCounting = () => {
    const stopStepCounting = () => {
      if (pedometerSubscription) {
        pedometerSubscription.remove();
        setPedometerSubscription(null);

        axios
          .put(
            `${Server}/api/insights/steps/update/${currentSteps}/${user._id}`,
          )
          .then(res => {
            setCurrentSteps(res.data.steps);
          })
          .catch(error => {
            console.error('Error updating steps:', error);
          });
      }
    };
  };

  const toggleStepTracking = () => {
    setIsTrackingSteps(prev => !prev);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchInsights().finally(() => setRefreshing(false));
  };

  if (!insights) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.Secondary} />
      </View>
    );
  }

  const handleLogout = () => {
    axios.post(`${Server}/auth/logout`).then(res => {
      setSocialUser(undefined);
      setUser(undefined);
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    });
  };

  const hydrationProgress =
    insights.hydration.totalWaterIntake / insights.hydration.hydrationGoal;
  const workoutProgress =
    insights.workout.completedWorkouts / insights.workout.totalWorkouts;
  const stepsProgress = insights.steps.totalSteps / insights.steps.stepsGoal;

  return (
    <View style={styles.mainContainer}>
      <View style={[styles.header, {marginTop: top}]}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Notification_Screen', {
              socialUser: socialUser,
            });
          }}>
          <Icon
            name="notifications"
            size={30}
            color={Colors.TextPrimary}
          />
        </TouchableOpacity>
      </View>

      {offline && (
        <View style={styles.offlineBar}>
          <Text style={styles.offlineText}>No internet connection</Text>
        </View>
      )}

      <ScrollView
        ref={scrollViewRef}
        style={[styles.container, {marginBottom: bottom + 16}]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.banner}>
          <Image
            source={{uri: socialUser.profilePic}}
            style={styles.bannerImage}
          />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.greeting}>
              Hello, {socialUser ? socialUser.firstName : 'Loading'}
            </Text>
            <Text style={[styles.welcome]}>Welcome Back</Text>
          </View>
        </View>

        <View style={styles.metricsContainer}>
          <TouchableOpacity
            style={styles.metricBoxStreak}
            onPress={() => setStreakModalVisible(true)}>
            <Icon name="local-fire-department" size={30} color={Colors.Error} />
            <Text style={styles.metricValue}>
              {insights.streak.currentStreak}
            </Text>
            <Text style={styles.metricLabel}>Streak Days</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.metricBoxBMI}
            onPress={() => setBMIModalVisible(true)}>
            <Icon name="accessibility" size={30} color={Colors.Success} />
            <Text style={styles.metricValue}>
              {insights.healthMatrics.bmi.toFixed(1)}
            </Text>
            <Text style={styles.metricLabel}>BMI</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.metricBoxAge}
            onPress={() => setAgeModalVisible(true)}>
            <Icon name="calendar-month" size={30} color={Colors.Blue} />
            <Text style={styles.metricValue}>{insights.healthMatrics.age}</Text>
            <Text style={styles.metricLabel}>Age</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.metricBoxHydration}
            onPress={() => setHydrationModalVisible(true)}>
            <Icon name="opacity" size={30} color={Colors.Blue} />
            <Text style={styles.metricValue}>
              {insights.hydration.hydrationGoal}
            </Text>
            <Text style={styles.metricLabel}>Hydration Goal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.metricBoxSteps,
              isTrackingSteps
                ? {backgroundColor: 'red'}
                : {backgroundColor: Colors.CardBackground},
            ]}
            onPress={() => setStepsModalVisible(true)}>
            <Icon name="directions-run" size={30} color={Colors.TintColorLight} />
            <Text style={styles.metricValue}>
              {currentSteps + olderStepsCount}
            </Text>
            <Text style={styles.metricLabel}>Steps</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.metricBoxWorkout}
            onPress={() => setWorkoutModalVisible(true)}>
            <Icon name="fitness-center" size={30} color={Colors.Success} />
            <Text style={styles.metricValue}>
              {insights.workout.completedWorkouts}
            </Text>
            <Text style={styles.metricLabel}>Workout</Text>
          </TouchableOpacity>
        </View>

        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: Colors.Blue,
              marginBottom: 90,
              padding: 10,
              borderRadius: 15,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Icon
                color={Colors.Secondary}
                name="exit-to-app"
                size={20}
                style={{marginLeft: 5}}
              />
            <Text
              style={{
                textAlign: 'center',
                color: Colors.Secondary,
                fontSize: 18,
              }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modals */}
      <StreakModal
        isVisible={isStreakModalVisible}
        onClose={() => setStreakModalVisible(false)}
        streakDays={insights.streak.currentStreak}
      />
      <BMIModal
        isVisible={isBMIModalVisible}
        onClose={() => setBMIModalVisible(false)}
        bmi={insights.healthMatrics.bmi}
      />
      <AgeModal
        isVisible={isAgeModalVisible}
        onClose={() => setAgeModalVisible(false)}
        age={insights.healthMatrics.age}
      />
      <HydrationModal
        isVisible={isHydrationModalVisible}
        onClose={() => setHydrationModalVisible(false)}
        hydrationGoal={insights.hydration.hydrationGoal}
      />
      <StepsModal
        isVisible={isStepsModalVisible}
        onClose={() => setStepsModalVisible(false)}
        steps={currentSteps + olderStepsCount}
        isTrackingSteps={isTrackingSteps}
        toggleStepTracking={toggleStepTracking}
      />
      <WorkoutModal
        isVisible={isWorkoutModalVisible}
        onClose={() => setWorkoutModalVisible(false)}
        workouts={insights.workout.completedWorkouts}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.Primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: Colors.Primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: 80,
    zIndex: 1,
  },
  offlineBar: {
    backgroundColor: 'red',
    padding: 8,
    alignItems: 'center',
  },
  offlineText: {
    color: 'white',
    fontSize: 14,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  banner: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  bannerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 15,
  },
  bannerTextContainer: {
    flex: 1,
  },
  greeting: {
    color: Colors.TextPrimary,
    fontSize: 19,
    fontWeight: 'bold',
  },
  welcome: {
    color: Colors.TextSecondary,
    fontSize: 18,
  },
  metricsContainer: {
    width: '100%',
    height: 700,
    position: 'relative',
    marginBottom: 200,
  },
  metricBoxStreak: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '48%',
    height: '30%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.CardBackground,
    elevation: 5,
  },
  metricBoxBMI: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '48%',
    height: '60%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.CardBackground,
    elevation: 5,
  },
  metricBoxAge: {
    position: 'absolute',
    top: '32%',
    left: 0,
    width: '48%',
    height: '28%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.CardBackground,
    elevation: 5,
  },
  metricBoxHydration: {
    position: 'absolute',
    bottom: 50,
    right: 0,
    width: '100%',
    height: '30%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.CardBackground,
    elevation: 5,
  },
  metricBoxSteps: {
    position: 'absolute',
    top: 680,
    left: 0,
    width: '48%',
    height: '30%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.CardBackground,
    elevation: 5,
  },
  metricBoxWorkout: {
    position: 'absolute',
    top: 680,
    right: 0,
    width: '48%',
    height: '30%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.CardBackground,
    elevation: 5,
  },
  metricLabel: {
    color: Colors.Secondary,
    fontSize: 12,
    marginTop: 8,
  },
  metricValue: {
    color: Colors.Secondary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Primary,
  },
});

export default HomeScreen;
