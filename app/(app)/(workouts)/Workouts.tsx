import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Modal,
  Pressable,
  ActivityIndicator,
  ToastAndroid,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {days, headers} from '../../../constants/RapidApi';
import {Server} from '../../../constants/Configs';
import {UserContext} from '../../../context/UserContext';
import {Colors} from '../../../constants/Colors';
import styles from '../../../components/private/workouts/workout.styles';
import {
  ExerciseCard,
  ExerciseCardL,
} from '../../../components/private/workouts/ExerciseCard';
import CategoryButton from '../../../components/private/workouts/CategoryButton';
import ExerciseModal from '../../../components/private/workouts/ExerciseModal';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import Pedometer from 'react-native-pedometer'; // Import Pedometer for step tracking
import Svg, {Path} from 'react-native-svg'; // Import SVG for icons
import LottieView from 'lottie-react-native';
import Header from '../../../components/private/workouts/Header';
import {ActivityCard} from '../../../components/private/workouts/ActivityCard';
import {ExerciseList} from '../../../components/private/workouts/ExerciseList';
import {WorkoutCategorySelector} from '../../../components/private/workouts/WorkoutCategory';
import {ChallengeModal} from '../../../components/private/workouts/ChallengeModal';
import {DaySelectorModal} from '../../../components/private/workouts/DaySelector';
import {useNavigation} from '@react-navigation/native';

const Workouts = () => {
  const {user, setUser} = useContext(UserContext);
  const [targets] = useState([
    'gym',
    'home',
    'back',
    'cardio',
    'chest',
    'lower arms',
    'lower legs',
    'neck',
    'shoulders',
    'upper arms',
    'upper legs',
    'waist',
  ]);
  const [category, setCategory] = useState('gym');
  const [exercises, setExercises] = useState([]);
  const [recommendedExercises, setRecommendedExercises] = useState([]);
  const [todaysExercises, setTodaysExercises] = useState([]);
  const [todaysExercisesFetched, setTodaysExercisesFetched] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [dayModalVisible, setDayModalVisible] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(false);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const [loadingToday, setLoadingToday] = useState(false);
  const [selectedExerciseName, setSelectedExerciseName] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [scheduled, setScheduled] = useState(false);
  const [posted, setPosted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [todos, setTodos] = useState([]);
  const [challengeModalVisible, setChallengeModalVisible] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const navigation = useNavigation();
  // State for step tracking
  const [isTrackingSteps, setIsTrackingSteps] = useState(false);
  const [currentSteps, setCurrentSteps] = useState(0);
  const [pedometerSubscription, setPedometerSubscription] = useState(null);

  const RECOMMENDED_CACHE_KEY = `recommended_${user._id}`;
  const TODAY_EXERCISES_CACHE_KEY = `today_exercises_${user._id}`;

  useEffect(() => {
    fetchTodaysExercises();
  }, [posted]);
  useEffect(() => {
    initalLoad();
  }, []);
  const startStepCounting = async challenge => {
    const isPedometerAvailable = await Pedometer.isAvailableAsync();
    if (!isPedometerAvailable) {
      console.log('Pedometer not available.');
      ToastAndroid.show('Pedometer not available', ToastAndroid.SHORT);
      return;
    }

    const {status} = await Pedometer.getPermissionsAsync();
    if (status !== 'granted') {
      const permissionResult = await Pedometer.requestPermissionsAsync();
      if (permissionResult.status !== 'granted') {
        ToastAndroid.show(
          'Permission is required to track steps.',
          ToastAndroid.SHORT,
        );
        return;
      }
    }

    const subscription = Pedometer.watchStepCount(async result => {
      console.log(challenge);
      setCurrentSteps(result.steps);
      // Check if user has reached the required steps for the challenge
      if (challenge && result.steps >= challenge.steps) {
        try {
          await axios.put(
            `${Server}/api/challenges/completion/${challenge._id}/${user._id}`,
          );
          setUser(prevUser => ({
            ...prevUser,
            gymPoints: prevUser.gymPoints + challenge.gymPoints,
          }));
          ToastAndroid.show(
            'Challenge marked as completed',
            ToastAndroid.SHORT,
          );
          setChallengeModalVisible(false);
          setPosted(!posted);
        } catch (err) {
          console.error(err.message);
          ToastAndroid.show(
            'Failed to mark challenge as completed',
            ToastAndroid.SHORT,
          );
        } finally {
          stopStepCounting();
        } // Automatically mark the challenge as completed
      }
    });

    setPedometerSubscription(subscription);
  };

  const stopStepCounting = () => {
    if (pedometerSubscription) {
      pedometerSubscription.remove();
      setPedometerSubscription(null);
    }
  };

  const toggleStepTracking = challenge => {
    if (isTrackingSteps) {
      stopStepCounting();
    } else {
      startStepCounting(challenge);
    }
    setIsTrackingSteps(!isTrackingSteps);
  };

  const fetchTodaysExercises = async () => {
    setLoadingToday(true);
    try {
      const cachedData = await AsyncStorage.getItem(TODAY_EXERCISES_CACHE_KEY);
      if (cachedData) {
        const {workoutSchedule, challenges} = JSON.parse(cachedData);
        processTodaysData(workoutSchedule, challenges);
        setLoadingToday(false);
        return;
      }
      const res = await axios.get(
        `${Server}/api/workouts/schedule/completion/${user._id}/${
          days[new Date().getDay()]
        }`,
      );
      const workoutSchedule = res.data.workoutSchedule;
      const challenges = res.data.challenges || [];

      await AsyncStorage.setItem(
        TODAY_EXERCISES_CACHE_KEY,
        JSON.stringify({workoutSchedule, challenges}),
      );
      processTodaysData(workoutSchedule, challenges);
      setTodaysExercises(workoutSchedule.workout);
    } catch (error) {
      console.error(error);
    }
    setLoadingToday(false);
  };

  const processTodaysData = (workoutSchedule, challenges) => {
    setTodos([
      {
        activityName: 'Challenge No 1',
        activityDescription: challenges.length
          ? challenges[0].description
          : 'No Challenge',
        challenge: challenges[0],
      },
      {
        activityName: 'Challenge No 2',
        activityDescription:
          challenges.length > 1 ? challenges[1].description : 'No Challenge',
        challenge: challenges[1],
      },
    ]);
  };

  useEffect(() => {
    let exerciseList = [];
    if (todaysExercises.length > 0) {
      todaysExercises[0].status;
      const exercisePromises = todaysExercises.map(element =>
        axios
          .get(
            `https://exercisedb.p.rapidapi.com/exercises/name/${element.exerciseName}`,
            {headers},
          )
          .then(res =>
            res.data[0] ? {...res.data[0], status: element.status} : null,
          )
          .catch(error => {
            console.error('Error fetching exercise data:', error);
            return null;
          }),
      );
      Promise.all(exercisePromises).then(results => {
        exerciseList = results.filter(exercise => exercise !== null);
        setTodaysExercisesFetched(exerciseList);
      });
    }
  }, [todaysExercises]);

  // Fetch recommended exercises based on body parts
  useEffect(() => {
    const fetchRecommendedExercises = async () => {
      let recommended = [];
      setLoadingRecommended(true);
      for (const recommendation of recommendations) {
        try {
          const res = await axios.get(
            `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${recommendation}?limit=7&offset=${Math.floor(
              Math.random() * 20,
            )}`,
            {headers},
          );
          recommended = [...recommended, ...res.data];
        } catch (err) {
          console.error(err);
        }
      }
      setRecommendedExercises(recommended);
      setLoadingRecommended(false);
    };

    if (recommendations.length > 0) {
      fetchRecommendedExercises();
    } else {
      setLoadingRecommended(false);
    }
  }, [recommendations]);

  // Fetch exercises based on the selected category
  useEffect(() => {
    setLoadingExercises(true);
    if (category === 'home') {
      axios
        .get(
          `https://exercisedb.p.rapidapi.com/exercises/equipment/assisted?limit=10&offset=0`,
          {headers},
        )
        .then(res => {
          setExercises(res.data);
          setLoadingExercises(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingExercises(false);
        });
    } else if (category === 'gym') {
      axios
        .get(
          `https://exercisedb.p.rapidapi.com/exercises?limit=10&offset=${Math.floor(
            Math.random() * 100,
          )}`,
          {headers},
        )
        .then(res => {
          setExercises(res.data);
          setLoadingExercises(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingExercises(false);
        });
    } else {
      axios
        .get(
          `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${category}?limit=10&offset=${Math.floor(
            Math.random() * 100,
          )}`,
          {headers},
        )
        .then(res => {
          setExercises(res.data);
          setLoadingExercises(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingExercises(false);
        });
    }
  }, [category]);
  async function initalLoad() {
    setPosted(!posted);
    axios
      .all([
        axios.get(`${Server}/api/workouts/recommendations/${user._id}/`, {
          headers,
        }),
        axios.get(
          `${Server}/api/workouts/schedule/completion/${user._id}/${
            days[new Date().getDay()]
          }`,
        ),
      ])
      .then(
        axios.spread((recommendationsRes, scheduleRes) => {
          setRecommendations(recommendationsRes.data.targetBody);
          const workoutSchedule = scheduleRes.data.workoutSchedule;
          const challenges = scheduleRes.data.challenges || [];
          processTodaysData(workoutSchedule, challenges);
        }),
      )
      .catch(error => {
        console.error(error);
      });
  }
  // Handle refresh action
  const onRefresh = () => {
    setPosted(!posted);
    setRefreshing(true);
    AsyncStorage.removeItem(RECOMMENDED_CACHE_KEY);
    AsyncStorage.removeItem(TODAY_EXERCISES_CACHE_KEY);

    axios
      .all([
        axios.get(`${Server}/api/workouts/recommendations/${user._id}/`, {
          headers,
        }),
        axios.get(
          `${Server}/api/workouts/schedule/completion/${user._id}/${
            days[new Date().getDay()]
          }`,
        ),
      ])
      .then(
        axios.spread((recommendationsRes, scheduleRes) => {
          setRecommendations(recommendationsRes.data.targetBody);
          const workoutSchedule = scheduleRes.data.workoutSchedule;
          const challenges = scheduleRes.data.challenges || [];

          processTodaysData(workoutSchedule, challenges);
          setRefreshing(false);
        }),
      )
      .catch(error => {
        console.error(error);
        setRefreshing(false);
      });
  };

  const handleExerciseSelect = (exercise, scheduled) => {
    setSelectedExercise(exercise);
    setSelectedExerciseName(exercise.name);
    setScheduled(scheduled);
    setModalVisible(true);
  };

  const handleDaySelect = day => {
    setSelectedDay(day);
    axios
      .post(`${Server}/api/workouts/schedule/`, {
        userId: user._id,
        day: day,
        exercises: [selectedExerciseName],
        time: 1000,
      })
      .then(res => {
        if (res.status === 200) {
          setPosted(!posted);
          ToastAndroid.show(
            'Exercise scheduled successfully',
            ToastAndroid.SHORT,
          );
        }
      })
      .catch(err => {
        console.error(err.message);
      });

    setSelectedExerciseName('');
    setSelectedDay('');
    setDayModalVisible(false);
  };

  const handleChallengeClick = challenge => {
    setSelectedChallenge(challenge);
    setChallengeModalVisible(true);
    toggleStepTracking(challenge);
  };

  const playExercises = (ex, sc) => {
    if (sc === 'Scheduled Exercises') {
      const startIndex = todaysExercisesFetched.indexOf(ex);
      if (startIndex !== -1) {
        setSelectedExercise([]);
        setSelectedExerciseName('');
        setScheduled(false);
        setModalVisible(false);
        navigation.navigate('Play_Workouts', {
          request: 'Scheduled Exercises',
          exercisesLoaded: todaysExercisesFetched.slice(startIndex),
        });
      }
    } else {
      setSelectedExercise([]);
      setSelectedExerciseName('');
      setScheduled(false);
      setModalVisible(false);
      navigation.navigate('Play_Workouts', {
        request: 'Recommended Exercises',
        recommendations: ex,
      });
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.Primary}}>
      <FlatList
      showsVerticalScrollIndicator={false}
        style={{backgroundColor: Colors.Primary, padding: 10}}
        ListHeaderComponent={
          <View>
            <Header />
            <Text style={styles.sectionTitle}>Activities Today</Text>
            {loadingToday ? (
              <ActivityIndicator size="large" color={Colors.TintColorDark} />
            ) : (
              <FlatList
                data={todos}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <ActivityCard
                    item={item}
                    handleChallengeClick={handleChallengeClick}
                  />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            )}

            <Text style={styles.sectionTitle}>Today's Exercises</Text>
            <ExerciseList
              todays={true}
              exercises={todaysExercisesFetched}
              isLoading={loadingRecommended}
              onSelectExercise={handleExerciseSelect}
            />

            <Text style={styles.sectionTitle}>Recommended</Text>
            <ExerciseList
              exercises={recommendedExercises}
              isLoading={loadingRecommended}
              onSelectExercise={handleExerciseSelect}
            />

            <Text style={styles.sectionTitle}>All Workouts</Text>
            <WorkoutCategorySelector
              categories={targets}
              selectedCategory={category}
              onSelectCategory={setCategory}
            />
          </View>
        }
        data={exercises}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ExerciseCardL
            item={item}
            onPress={() => handleExerciseSelect(item)}
          />
        )}
        numColumns={1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {modalVisible && selectedExercise && (
        <ExerciseModal
          visible={modalVisible}
          exercise={selectedExercise}
          scheduled={scheduled}
          onPlayExercises={playExercises}
          onClose={() => {
            setModalVisible(false);
            setSelectedExercise(null);
            setSelectedExerciseName('');
            setScheduled(false);
          }}
          onSchedule={() => {
            setModalVisible(false);
            setDayModalVisible(true);
          }}
        />
      )}

      <ChallengeModal
        visible={challengeModalVisible}
        selectedChallenge={selectedChallenge}
        currentSteps={currentSteps}
        onClose={() => setChallengeModalVisible(false)}
      />

      <DaySelectorModal
        visible={dayModalVisible}
        onSelectDay={handleDaySelect}
        onClose={() => setDayModalVisible(false)}
      />
    </View>
  );
};

export default Workouts;
