import { Colors } from "../../../constants/Colors";
import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { headers } from "../../../constants/RapidApi";
import { Server } from "../../../constants/Configs";
import { UserContext } from "../../../context/UserContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";
import LottieView from "lottie-react-native";

const TIMER_DURATION = 30; // Timer duration in seconds

const PlayWorkouts = ({ route }) => {
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completedExercises, setCompletedExercises] = useState({});
  const slideAnim = useRef(new Animated.Value(0)).current;
  const { user } = useContext(UserContext);
  const navigation = useNavigation();

  const { request, exercisesLoaded, recommendations, random, category } =
    route.params;
  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        if (request === "Scheduled Exercises") {
          setExercises(exercisesLoaded);
          setLoading(false);
        } else if (request === "Recommended Exercises") {
          setExercises([recommendations]);
          setLoading(false);
        } else if (request === "Random Exercises") {
          setExercises(random);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching exercises:", error);
        setLoading(false);
      }
    };

    fetchExercises();
  }, [request, exercisesLoaded, recommendations, random, category]);

  useEffect(() => {
    let interval = null;
    if (isPlaying && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && timer === 0) {
      clearInterval(interval);
      setIsPlaying(false); // Stop the timer
      markExerciseComplete(); // Mark exercise complete when timer reaches zero
    }

    return () => clearInterval(interval);
  }, [isPlaying, timer]);

  const markExerciseComplete = () => {
    // console.log(exercises);
    const currentExerciseName = exercises[currentExercise].name;

    if (request === "Scheduled Exercises") {
      console.log(
        `${Server}/api/workouts/schedule/completion/${user._id}/${currentExerciseName}`
      );
      // Mark exercise as complete in the state to prevent multiple calls
      setCompletedExercises((prev) => ({
        ...prev,
        [currentExercise]: true,
      }));

      // Call API to mark exercise complete
      axios
        .put(
          `${Server}/api/workouts/schedule/completion/${user._id}/${exercises[currentExercise].name}`
        )
        .then(() => {
          handleCompletion(); // Handle the next steps after marking complete
        })
        .catch((error) =>
          console.error("Error marking exercise complete:", error)
        );
    } else {
      // Directly handle the next steps if not a Scheduled Exercise
      handleCompletion();
    }
  };

  const handleCompletion = () => {
    if (currentExercise < exercises.length - 1) {
      // Move to the next exercise
      setCurrentExercise((prev) => prev + 1);
      setTimer(TIMER_DURATION); // Reset timer for next exercise
      setIsPlaying(true); // Automatically start next exercise
      slideIn();
    } else {
      setTimeout(() => {
        setExercises([]);
        resetWorkout(); // Reset after completing all exercises
      }, 500); // Small delay to ensure completion feels smooth
    }
  };

  const resetWorkout = () => {
    setCurrentExercise(0);
    setTimer(TIMER_DURATION);
    setIsPlaying(false);
  };

  const leaveWorkout = () => {
    resetWorkout();
    navigation.navigate("Workouts");
  };

  const slideIn = () => {
    slideAnim.setValue(300);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    slideIn();
  }, [currentExercise]);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const renderExercise = ({ item }) => (
    <Animated.View
      style={[
        styles.exerciseContainer,
        { transform: [{ translateX: slideAnim }] },
      ]}
    >
      <Text style={styles.exerciseName}>
        {capitalizeFirstLetter(item.name)}
      </Text>
      <View style={{ borderRadius: 20, marginBottom: 10, overflow: "hidden" }}>
        <Image
          source={{ uri: item.gifUrl }}
          style={{
            width: 300,
            height: 300,
            borderRadius: 20,
          }}
        />
      </View>
      <Text style={styles.bodyPart}>
        Body Part: {item.bodyPart} | Target: {item.target}
      </Text>
      <Text style={styles.equipment}>Equipment: {item.equipment}</Text>
      <Text style={styles.secondaryMuscles}>
        Secondary Muscles: {item.secondaryMuscles}
      </Text>
      <AnimatedCircularProgress
        size={150}
        width={8}
        fill={((TIMER_DURATION - timer) / TIMER_DURATION) * 100}
        tintColor={Colors.Error}
        backgroundColor={Colors.CardBackground}
        style={styles.progressCircle}
      >
        {() => <Text style={styles.timerText}>{timer}s</Text>}
      </AnimatedCircularProgress>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={togglePlayPause}
          style={styles.playPauseButton}
        >
          <Icon
            name={isPlaying ? "pause-circle" : "play-circle"}
            size={24}
            color={Colors.Secondary}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.playPauseButtonText}>
            {isPlaying ? "Pause" : "Play"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={leaveWorkout} style={styles.leaveButton}>
          <Icon
            name="exit-to-app"
            size={24}
            color={Colors.Primary}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.leaveButtonText}>Leave</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.instructionsContainer, { marginTop: 30 }]}>
        {item.instructions.map((instruction, index) => (
          <Text key={index} style={[styles.instructionText]}>
            {index + 1}. {instruction}
          </Text>
        ))}
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Colors.Error} size={40} />
          <Text style={{ color: Colors.Secondary }}>
            Getting your sets ready, hold tight
          </Text>
        </View>
      ) : exercises.length > 0 ? (
        <FlatList
          data={[exercises[currentExercise]]}
          renderItem={renderExercise}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <LottieView
            source={{
              uri: "https://lottie.host/29c41d9f-6b5a-4ebd-86f7-309b952bd8e6/mw68cOCiD4.json",
            }}
            autoPlay
            loop
            style={{ width: 300, height: 300 }}
          />
          <Text style={styles.noExercisesText}>
            {request != "Scheduled Exercises"
              ? "👍 Thats pretty much it."
              : "Congratulations! You've completed all exercises! 💪"}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Primary,
    padding: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  exerciseContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: Colors.CardBackground,
    borderRadius: 8,
    borderColor: Colors.CardBorder,
    borderWidth: 1,
    alignItems: "center",
  },
  exerciseName: {
    color: Colors.TextPrimary,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  gifImage: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginBottom: 10,
  },
  bodyPart: {
    color: Colors.TextSecondary,
    fontSize: 16,
    marginBottom: 5,
  },
  equipment: {
    color: Colors.TextSecondary,
    fontSize: 16,
    marginBottom: 5,
  },
  secondaryMuscles: {
    color: Colors.TextSecondary,
    fontSize: 16,
    marginBottom: 10,
  },
  instructionsContainer: {
    marginBottom: 10,
  },
  instructionText: {
    color: Colors.TextPrimary,
    fontSize: 14,
    marginBottom: 5,
  },
  progressCircle: {
    marginVertical: 15,
  },
  timerText: {
    color: Colors.Secondary,
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  playPauseButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.Error,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  playPauseButtonText: {
    color: Colors.Secondary,
    fontSize: 18,
    fontWeight: "bold",
  },
  leaveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.Secondary,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
  leaveButtonText: {
    color: Colors.Primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  noExercisesText: {
    color: Colors.TextSecondary,
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PlayWorkouts;
