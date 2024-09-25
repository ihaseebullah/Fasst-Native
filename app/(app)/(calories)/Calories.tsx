//@ts-nocheck

import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
  ToastAndroid,
  Modal,
  Pressable,
  ScrollView,
  DevSettings,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Server} from '../../../constants/Configs';
import {UserContext} from '../../../context/UserContext';
import CaloriesChart from '../../../components/private/calories/CaloriesChart';
import CaloriesDisplay from '../../../components/private/calories/CaloriesDisplay';
import FoodCard from '../../../components/private/calories/FoodCard';
import SearchBar from '../../../components/private/calories/SearchBar';
import {Colors} from '../../../constants/Colors';
import {useRoute, useNavigation} from '@react-navigation/native';
import DaySelector from '../../../components/private/calories/DaySelctor';
import  Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import {checkUserLogin} from '../../../utils/checkUserIsLoggedIn';
import {capitalizeFirstLetter} from '../../../utils/capitalizeFirstLetter';
const Calories = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {user, setUser} = useContext(UserContext);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [dailyRecord, setDailyRecord] = useState([]);
  const [foods, setFoods] = useState([]);
  const [caloriesConsumedToday, setCaloriesConsumedToday] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [recipies, setRecipies] = useState([]);
  const [loadingChartData, setLoadingChartData] = useState(false);
  const [loadingFoodHistory, setLoadingFoodHistory] = useState(false);
  const [loadingRecipies, setLoadingRecipies] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [setPref, setSetPref] = useState(false);
  const [recipesPreferences, setRecipesPreferences] = useState({
    dietaryPreference: '',
    healthGoal: '',
    cuisinePreference: '',
    mealsPerDay: '',
    allergies: '',
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track the current question

  const images = [
    'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1423483641154-5411ec9c0ddf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1476224203421-9ac39bcb332e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1543352634-a254cf47733d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1546069901-eacef0df6022?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1572441710129-bc0e5ed82d6e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ];
  useEffect(() => {
    const refresh = route.params?.refresh;
    setLoadingChartData(true);
    axios
      .get(`${Server}/api/food-data-gathering/food-intake/${user._id}/`)
      .then(res => {
        setDailyRecord(res.data);
        setSelectedDayIndex(0);
        const chartData = res.data.map(record => ({
          day: record.createdAt,
          calories: record.caloriesConsumed,
        }));
        setChartData(chartData);
      })
      .catch(error => console.error('Error fetching food data:', error))
      .finally(() => setLoadingChartData(false));

    navigation.setParams({refresh: false});
  }, [route.params?.refresh]);

  useEffect(() => {
    setLoadingRecipies(true);
    axios
      .get(`${Server}/api/recipes/food/recommendations/${user._id}`)
      .then(res => {
        console.log(res.data);
        setRecipies(res.data);
      })
      .catch(error => console.error('Error fetching recipes:', error))
      .finally(() => setLoadingRecipies(false));
  }, []);

  useEffect(() => {
    setLoadingFoodHistory(true);
    if (selectedDayIndex !== null && dailyRecord[selectedDayIndex]) {
      const selectedDayData = dailyRecord[selectedDayIndex];
      setFoods(selectedDayData.foods || []);
      setCaloriesConsumedToday(selectedDayData.caloriesConsumed || 0);
    }
    setLoadingFoodHistory(false);
  }, [selectedDayIndex, dailyRecord]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSavePreferences = () => {
    axios
      .put(`${Server}/api/data-gathering/diet-plan/${user._id}`, {
        ...recipesPreferences, // Spread recipesPreferences directly into the object
      })
      .then(res => {
        console.log({...recipesPreferences});
        setUser({
          ...user,
          RECIPE_PREFRENCES: res.data.RECIPE_PREFRENCES, // Update user context with new preferences
        });
        ToastAndroid.show('Preferences saved!', ToastAndroid.SHORT); // Show success message
      })
      .catch(error => {
        console.error('Error saving preferences:', error);
        ToastAndroid.show('Failed to save preferences', ToastAndroid.SHORT); // Show error message
      })
      .finally(() => {
        setModalVisible(false); // Close modal regardless of success or failure
      });
  };

  const updatePreference = (key, value) => {
    setRecipesPreferences(prevPreferences => ({
      ...prevPreferences,
      [key]: value, // Update the specific preference key with new value
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSavePreferences(); // Save preferences when the last question is answered
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const questions = [
    {
      title: 'What is your primary dietary preference?',
      options: ['Paleo', 'Keto', 'Vegan', 'Mediterranean', 'Dash'],
      key: 'dietaryPreference',
    },
    {
      title: 'Do you have any specific health goals?',
      options: ['Weight Loss', 'Muscle Gain', 'Heart Health'],
      key: 'healthGoal',
    },
    {
      title: 'What cuisines do you prefer?',
      options: ['American', 'Mexican', 'Chinese', 'Mediterranean'],
      key: 'cuisinePreference',
    },
    {
      title: 'Do you have any specific food allergies or intolerances?',
      options: ['peanuts', 'shellfish', 'soy', 'eggs'],
      key: 'allergies',
    },
    {
      title: 'How many meals per day do you prefer?',
      options: ['2 large meals', '3 meals', '4-5 small meals'],
      key: 'mealsPerDay',
    },
  ];

  const renderFoodCard = ({item}) => {
    const truncatedName = item.Recipe_name.substring(0, 15);
    return (
      <FoodCard
        foodObject={item}
        name={truncatedName}
        calories={`${item.Cuisine_type} `}
        image={images[Math.floor(Math.random() * images.length)]}
      />
    );
  };

  const renderFoodHistoryItem = ({item}) => {
    const truncatedName =
      item.name.length > 20
        ? `${capitalizeFirstLetter(item.name.substring(0, 30))}...`
        : capitalizeFirstLetter(item.name);
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          if (!item.foodId) {
            ToastAndroid.show("Can't navigate to this", ToastAndroid.SHORT);
          } else {
            navigation.navigate('Food_Details', {foodId: item.foodId});
          }
        }}>
        <ImageBackground
          blurRadius={10}
          source={{
            uri: images[Math.floor(Math.random() * images.length)],
          }}
          style={[styles.foodHistoryCard]}
          imageStyle={{borderRadius: 10}}>
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              zIndex: 1,
              borderRadius: 10,
            }}
          />
          <Text style={styles.foodHistoryName}>{truncatedName}</Text>
          <Text
            style={[
              styles.foodHistoryCalories,
              {flexDirection: 'row', alignItems: 'center'},
            ]}>
            <Ionicons name="fire" size={16} color={Colors.Secondary} />{' '}
            {`${item.calories} Kcal`}
          </Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar />
      <FlatList
        data={[]}
        renderItem={null}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <DaySelector
              daysOfWeek={dailyRecord.map((record, index) => ({
                id: index.toString(),
                day: new Date(record.createdAt).toLocaleDateString('en-US', {
                  weekday: 'short',
                }),
              }))}
              selectedDay={selectedDayIndex}
              setSelectedDay={setSelectedDayIndex}
            />
            <CaloriesDisplay
              consumption={caloriesConsumedToday}
              goal={user.calories}
              highestInWeek={Math.max(
                ...dailyRecord.map(record => record.caloriesConsumed),
              )}
            />

            {loadingChartData ? (
              <ActivityIndicator />
            ) : (
              <CaloriesChart
                loadingChartData={loadingChartData}
                data={chartData}
                goal={user.calories}
              />
            )}

            <View style={styles.horizontalListContainer}>
              <Text style={styles.sectionTitle}>
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={Colors.Secondary}
                />{' '}
                Diet Plans
              </Text>
              {user.RECIPE_PREFRENCES ? (
                <View style={{flex: 1}}>
                  {/* Display message if not loading and no recipes are available */}
                  {!loadingRecipies && recipies.length === 0 && (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={{color: Colors.Secondary}}>No data yet</Text>
                      <TouchableOpacity onPress={toggleModal}>
                        <Text style={{color: Colors.Blue}}>
                          Set Preferences
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Show recipes if not loading */}
                  {!loadingRecipies ? (
                    <FlatList
                      data={recipies}
                      renderItem={renderFoodCard}
                      keyExtractor={item => item.Recipe_name}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.horizontalList}
                    />
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <ActivityIndicator />
                    </View>
                  )}
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity onPress={toggleModal}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                      }}>
                      <Ionicons
                        name="add-circle-outline"
                        color={Colors.Secondary}
                        size={50}
                      />
                      <Text style={{color: Colors.Secondary, marginTop: 5}}>
                        Set Preferences
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <Text style={styles.sectionTitle}>
              <Ionicons
                name="history"
                size={24}
                color={Colors.Secondary}
              />{' '}
              Food History
            </Text>
            <View style={{paddingHorizontal: 20}}>
              {loadingFoodHistory ? (
                <ActivityIndicator />
              ) : (
                <FlatList
                  data={foods}
                  renderItem={renderFoodHistoryItem}
                  keyExtractor={item => item._id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.foodHistoryList}
                />
              )}
            </View>
          </View>
        }
      />

      {/* Full-Screen Modal for setting preferences */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}>
        <View style={styles.fullScreenModalContainer}>
          <Text style={styles.modalTitle}>
            {questions[currentQuestionIndex].title}
          </Text>
          {questions[currentQuestionIndex].options.map(option => (
            <TouchableOpacity
              key={option}
              onPress={() =>
                updatePreference(questions[currentQuestionIndex].key, option)
              }
              style={[
                styles.modalOption,
                recipesPreferences[questions[currentQuestionIndex].key] ===
                  option && {
                  backgroundColor: Colors.Error,
                },
              ]}>
              <Text style={styles.modalOptionText}>{option}</Text>
            </TouchableOpacity>
          ))}

          <View style={styles.navigationButtons}>
            {currentQuestionIndex > 0 && (
              <Pressable style={styles.prevButton} onPress={previousQuestion}>
                <Text style={styles.prevButtonText}>Previous</Text>
              </Pressable>
            )}
            <Pressable style={styles.nextButton} onPress={nextQuestion}>
              <Text style={styles.nextButtonText}>
                {currentQuestionIndex === questions.length - 1
                  ? 'Save'
                  : 'Next'}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 50,
    backgroundColor: Colors.Primary,
  },
  listContent: {
    backgroundColor: Colors.Primary,
    paddingVertical: 20,
  },
  horizontalListContainer: {
    minHeight: 270,
    maxHeight: 270,
    marginTop: 20,
  },
  horizontalList: {
    paddingHorizontal: 10,
  },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.TextPrimary,
  },
  foodHistoryList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  foodHistoryCard: {
    backgroundColor: Colors.CardBackground,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: Colors.ST,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'space-between',
    height: 180,
  },
  foodHistoryName: {
    fontSize: 34,
    fontWeight: 'bold',
    color: Colors.TextPrimary,
    zIndex: 10,
  },
  foodHistoryCalories: {
    padding: 5,
    borderRadius: 10,
    backgroundColor: Colors.Error,
    fontSize: 18,
    fontWeight: 'bold',
    maxWidth: 120,
    zIndex: 10,
    textAlign: 'center',
    color: Colors.TextPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Primary,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.TextPrimary,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.TextPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    borderColor: Colors.CardBackground,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 1,
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
    width: '80%',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    color: Colors.TextPrimary,
  },
  navigationButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  prevButton: {
    marginRight: 10,
    backgroundColor: Colors.Secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  prevButtonText: {
    fontSize: 16,
    color: Colors.Primary,
  },
  nextButton: {
    backgroundColor: Colors.Blue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  nextButtonText: {
    fontSize: 16,
    color: Colors.Secondary,
  },
});

export default Calories;
