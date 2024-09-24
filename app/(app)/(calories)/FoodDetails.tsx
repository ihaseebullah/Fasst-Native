// components/FoodDetails.js
import {Colors} from '../../../constants/Colors';
import {Server} from '../../../constants/Configs';
import {UserContext} from '../../../context/UserContext';
import {capitalizeFirstLetter} from '../../../utils/capitalizeFirstLetter';
import  Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FoodDetails = ({route}) => {
  const [foodData, setFoodData] = useState(null); // Initialize with null
  const [loading, setLoading] = useState(true); // State to manage loading
  const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility
  const [servingSize, setServingSize] = useState(''); // State to manage serving size input
  const id = route.params.foodId;
  const {user} = useContext(UserContext);
  const navigation = useNavigation();

  useEffect(() => {
    axios
      .get(`${Server}/api/search/food/byId/${id}`)
      .then(res => {
        setFoodData(res.data);
      })
      .catch(error => {
        console.error('Error fetching food details:', error);
      })
      .finally(() => {
        setLoading(false); // Set loading to false once data is fetched
      });
  }, [id]);

  const handleConsumeFood = () => {
    setModalVisible(true);
  };

  const handleCalculateCalories = () => {
    if (!servingSize || isNaN(servingSize)) {
      console.error('Please enter a valid serving size in grams.');
      return;
    }
    const baseServingSize =
      foodData.Data['Household Weights']['1st Household Weight']; // Assume the base serving size is the first household weight
    const baseCalories = foodData.Data.Kilocalories;

    const calculatedCalories =
      (baseCalories / baseServingSize) * parseFloat(servingSize);
    console.log(`Consumed: ${foodData.Description}`);
    console.log(`Serving Size: ${servingSize} grams`);
    console.log(`Calories Consumed: ${calculatedCalories.toFixed(2)} kcal`);
    axios
      .post(`${Server}/api/food-data-gathering/food-intake/`, {
        userId: user._id,
        foodName: foodData.Category,
        foodCalories: calculatedCalories.toFixed(2),
        foodId: id,
        servingSize: parseFloat(servingSize),
      })
      .then(res => {
        if (res.status === 201) {
          setServingSize('');
          Alert.alert('Success', 'Food consumption recorded successfully');
          navigation.navigate('Calories', {refresh: true});
        }
      })
      .catch(e => {
        Alert.alert(
          'Error',
          'Failed to record food consumption. Please try again.',
        );
        console.error(e);
      });

    setModalVisible(false); // Close the modal after calculation
  };

  const handleBack = () => {
    navigation.navigate('Calories'); // Assuming navigation prop is passed and configured properly
    setModalVisible(false);
  };

  // If loading is true, show ActivityIndicator
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.Blue} />
      </View>
    );
  }

  // Once loading is false and foodData is available, render the details
  return (
    <View style={[styles.mainContainer]}>
      <ScrollView style={[styles.container]}>
        <Text style={styles.title}>
          {capitalizeFirstLetter(foodData.Category)}
        </Text>
        <Text style={styles.subtitle}>
          {capitalizeFirstLetter(foodData.Description)}
        </Text>

        {/* Nutrient Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrient Information</Text>
          <Text style={styles.item}>
            <Ionicons name="flame-outline" size={16} color={Colors.Secondary} />{' '}
            <Text style={styles.label}>Calories:</Text>{' '}
            {foodData.Data.Kilocalories} kcal
          </Text>
          <Text style={styles.item}>
            <Ionicons
              name="restaurant-outline"
              size={16}
              color={Colors.Secondary}
            />{' '}
            <Text style={styles.label}>Carbohydrate:</Text>{' '}
            {foodData.Data.Carbohydrate} g
          </Text>
          <Text style={styles.item}>
            <Ionicons
              name="fitness-outline"
              size={16}
              color={Colors.Secondary}
            />{' '}
            <Text style={styles.label}>Protein:</Text> {foodData.Data.Protein} g
          </Text>
          <Text style={styles.item}>
            <Ionicons name="water-outline" size={16} color={Colors.Secondary} />{' '}
            <Text style={styles.label}>Total Fat:</Text>{' '}
            {foodData.Data.Fat['Total Lipid']} g
          </Text>
          <Text style={styles.item}>
            <Ionicons name="alert-outline" size={16} color={Colors.Secondary} />{' '}
            <Text style={styles.label}>Saturated Fat:</Text>{' '}
            {foodData.Data.Fat['Saturated Fat']} g
          </Text>
          <Text style={styles.item}>
            <Ionicons name="heart-outline" size={16} color={Colors.Secondary} />{' '}
            <Text style={styles.label}>Monosaturated Fat:</Text>{' '}
            {foodData.Data.Fat['Monosaturated Fat']} g
          </Text>
          <Text style={styles.item}>
            <Ionicons name="leaf-outline" size={16} color={Colors.Secondary} />{' '}
            <Text style={styles.label}>Polysaturated Fat:</Text>{' '}
            {foodData.Data.Fat['Polysaturated Fat']} g
          </Text>
          <Text style={styles.item}>
            <Ionicons
              name="medkit-outline"
              size={16}
              color={Colors.Secondary}
            />{' '}
            <Text style={styles.label}>Cholesterol:</Text>{' '}
            {foodData.Data.Cholesterol} mg
          </Text>
        </View>

        {/* Vitamins Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vitamins</Text>
          <Text style={styles.item}>
            <Ionicons name="sunny-outline" size={16} color={Colors.Secondary} />{' '}
            <Text style={styles.label}>Vitamin A:</Text>{' '}
            {foodData.Data.Vitamins['Vitamin A - IU']} IU
          </Text>
          <Text style={styles.item}>
            <Ionicons name="leaf-outline" size={16} color={Colors.Secondary} />{' '}
            <Text style={styles.label}>Vitamin C:</Text>{' '}
            {foodData.Data.Vitamins['Vitamin C']} mg
          </Text>
          <Text style={styles.item}>
            <Ionicons name="bulb-outline" size={16} color={Colors.Secondary} />{' '}
            <Text style={styles.label}>Vitamin E:</Text>{' '}
            {foodData.Data.Vitamins['Vitamin E']} mg
          </Text>
          <Text style={styles.item}>
            <Ionicons name="flask-outline" size={16} color={Colors.Secondary} />{' '}
            <Text style={styles.label}>Vitamin K:</Text>{' '}
            {foodData.Data.Vitamins['Vitamin K']} μg
          </Text>
          <Text style={styles.item}>
            <Ionicons name="flask-outline" size={16} color={Colors.Secondary} />{' '}
            <Text style={styles.label}>Vitamin B12:</Text>{' '}
            {foodData.Data.Vitamins['Vitamin B12']} μg
          </Text>
        </View>

        {/* Minerals Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Minerals</Text>
          <Text style={styles.item}>
            <Ionicons name="medal-outline" size={16} color={Colors.Secondary} />{' '}
            <Text style={styles.label}>Calcium:</Text>{' '}
            {foodData.Data['Major Minerals'].Calcium} mg
          </Text>
          <Text style={styles.item}>
            <Ionicons
              name="medkit-outline"
              size={16}
              color={Colors.Secondary}
            />{' '}
            <Text style={styles.label}>Iron:</Text>{' '}
            {foodData.Data['Major Minerals'].Iron} mg
          </Text>
          <Text style={styles.item}>
            <Ionicons name="flask-outline" size={16} color={Colors.Secondary} />{' '}
            <Text style={styles.label}>Magnesium:</Text>{' '}
            {foodData.Data['Major Minerals'].Magnesium} mg
          </Text>
          <Text style={styles.item}>
            <Ionicons name="water-outline" size={16} color={Colors.Secondary} />{' '}
            <Text style={styles.label}>Potassium:</Text>{' '}
            {foodData.Data['Major Minerals'].Potassium} mg
          </Text>
          <Text style={styles.item}>
            <Ionicons name="flask-outline" size={16} color={Colors.Secondary} />{' '}
            <Text style={styles.label}>Sodium:</Text>{' '}
            {foodData.Data['Major Minerals'].Sodium} mg
          </Text>
          <Text style={styles.item}>
            <Ionicons name="leaf-outline" size={16} color={Colors.Secondary} />{' '}
            <Text style={styles.label}>Zinc:</Text>{' '}
            {foodData.Data['Major Minerals'].Zinc} mg
          </Text>
        </View>

        {/* Household Weights Section */}
        <View style={[styles.section, {marginBottom: 150}]}>
          <Text style={styles.sectionTitle}>Household Weights</Text>
          <Text style={styles.item}>
            <Ionicons name="scale-outline" size={16} color={Colors.Secondary} />{' '}
            {
              foodData.Data['Household Weights'][
                '1st Household Weight Description'
              ]
            }
            : {foodData.Data['Household Weights']['1st Household Weight']} g
          </Text>
          <Text style={styles.item}>
            <Ionicons name="scale-outline" size={16} color={Colors.Secondary} />{' '}
            {
              foodData.Data['Household Weights'][
                '2nd Household Weight Description'
              ]
            }
            : {foodData.Data['Household Weights']['2nd Household Weight']} g
          </Text>
        </View>
      </ScrollView>

      {/* Floating Buttons */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleConsumeFood}>
        <Ionicons name="nutrition-outline" size={24} color={Colors.Secondary} />
        <Text style={{color: '#fff'}}> Consume</Text>
      </TouchableOpacity>

      {/* Modal for Serving Size Input */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Serving Size (grams)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 100"
              placeholderTextColor={Colors.TextSecondary}
              keyboardType="numeric"
              value={servingSize}
              onChangeText={setServingSize}
            />
            {/* Container for buttons */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    flex: 1,
                    marginRight: 5,
                    backgroundColor: Colors.Secondary,
                    borderColor: Colors.Secondary,
                    borderWidth: StyleSheet.hairlineWidth,
                  },
                ]}
                onPress={handleCalculateCalories}>
                <Text
                  style={{
                    color: Colors.Primary,
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Save
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    flex: 1,
                    marginLeft: 5,
                    backgroundColor: Colors.Primary,
                    borderColor: Colors.Secondary,
                    borderWidth: StyleSheet.hairlineWidth,
                  },
                ]}
                onPress={() => setModalVisible(false)}>
                <Text
                  style={{
                    color: Colors.Secondary,
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.Blue,
    padding: 10,
    marginHorizontal: 25,
    borderRadius: 5,
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.Primary,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.Primary,
    marginBottom: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.Secondary,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.TextSecondary,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: Colors.CardBackground,
    borderRadius: 10,
    shadowColor: Colors.ST,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.Secondary,
  },
  item: {
    marginBottom: 5,
    fontSize: 16,
    color: Colors.TextPrimary,
  },
  label: {
    fontWeight: 'bold',
    color: Colors.Secondary,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 80, // Adjusted to ensure visibility above navbar
    right: 20,
    backgroundColor: Colors.Blue,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    zIndex: 1, // Ensures the button is above other elements
    flexDirection: 'row', // Align icon and text
  },
  backButton: {
    position: 'absolute',
    bottom: 60, // Adjusted to ensure visibility above navbar
    left: 20,
    backgroundColor: Colors.Secondary,
    borderColor: Colors.Primary,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    zIndex: 1, // Ensures the button is above other elements
    flexDirection: 'row', // Align icon and text
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: Colors.CardBackground,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.Secondary,
  },
  input: {
    height: 40,
    borderColor: Colors.TextSecondary,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '80%',
    color: Colors.Secondary, // Text color inside the input
  },
  calculateButton: {
    backgroundColor: Colors.Blue,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalCloseButton: {
    backgroundColor: Colors.Error,
    padding: 10,
    borderRadius: 5,
  },
});

export default FoodDetails;
