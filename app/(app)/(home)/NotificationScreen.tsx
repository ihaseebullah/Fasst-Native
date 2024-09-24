import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
  RefreshControl,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../../../constants/Colors';
import axios from 'axios';
import {Server} from '../../../constants/Configs';

const NotificationScreen = ({route}) => {
  const {socialUser} = route.params;
  const [dailyChallenges, setDailyChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [viewMore, setViewMore] = useState(false); // State to toggle showing all completed challenges
  const [refreshing, setRefreshing] = useState(false); // State to handle pull-to-refresh

  // Animation values
  const animationValue = useRef(new Animated.Value(0)).current;

  const fetchChallenges = () => {
    // Fetch challenges and set them as notifications
    axios
      .get(`${Server}/api/challenges/user/${socialUser.userId}`)
      .then(res => {
        const {challenges, completed} = res.data;

        // Format daily challenges
        const formattedDailyChallenges = challenges.map((challenge, index) => ({
          id: challenge._id + Math.random(),
          icon: 'trophy-outline',
          title: `Challenge ${index + 1}`,
          description: `${challenge.description} - Duration: ${challenge.duration}, Gym Points: ${challenge.gymPoints}`,
        }));

        // Format completed challenges
        const formattedCompletedChallenges = completed.map(
          (challenge, index) => ({
            id: challenge._id + Math.random(),
            icon: 'trophy',
            title: `Completed Challenge ${index + 1}`,
            description: `${challenge.description} - Duration: ${challenge.duration}, Gym Points: ${challenge.gymPoints}`,
          }),
        );

        setDailyChallenges(formattedDailyChallenges);
        setCompletedChallenges(formattedCompletedChallenges);

        // Start the animation
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      })
      .catch(error => {
        console.error('Error fetching challenges:', error);
      });
  };

  useEffect(() => {
    fetchChallenges();
  }, [socialUser.userId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchChallenges();
    setRefreshing(false);
  };

  const renderNotificationItem = ({item, index}) => {
    const translateY = animationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-20 * (index + 1), 0],
    });

    return (
      <Animated.View
        key={`${item.id}-${index}`}
        style={{...styles.notificationItem, transform: [{translateY}]}}>
        <Ionicons
          name={item.icon}
          size={30}
          color={item.icon === 'trophy' ? Colors.Blue : Colors.Error}
        />
        <View style={styles.notificationText}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationDescription}>{item.description}</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{uri: socialUser.profilePic}}
            style={{
              width: 50,
              height: 50,
              padding: 5,
              borderWidth: 2,
              borderColor: Colors.Blue,
              borderRadius: 100,
            }}
          />
          <View>
            <Text style={styles.greeting}>
              👋 Hello, {socialUser ? socialUser.firstName : 'Loading'}
            </Text>
            <Text style={[styles.welcome, {paddingLeft: 24}]}>
              Welcome Back
            </Text>
          </View>
        </View>
        <Ionicons name="bell" size={30} color={Colors.Error} />
      </View>

      <Text style={styles.sectionTitle}>Complete Your Daily Challenges</Text>
      <View>
        <FlatList
          data={dailyChallenges.slice(0, 2)}
          renderItem={renderNotificationItem}
          contentContainerStyle={[styles.notificationsList]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>

      <Text style={styles.sectionTitle}>Completed Challenges</Text>
      <FlatList
        data={viewMore ? completedChallenges : completedChallenges.slice(0, 2)}
        keyExtractor={item => `completed-${item.id}`} // Ensure unique keys
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.notificationsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Primary,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    color: Colors.TextPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  welcome: {
    color: Colors.TextSecondary,
    fontSize: 16,
  },
  sectionTitle: {
    color: Colors.TextPrimary,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10, // Reduced margin to decrease gap
    marginBottom: 5,
  },
  notificationsList: {
    paddingBottom: 10, // Reduced padding to decrease gap
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.CardBackground,
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 3,
  },
  notificationText: {
    marginLeft: 10,
    flex: 1,
  },
  notificationTitle: {
    color: Colors.TextPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationDescription: {
    color: Colors.TextSecondary,
    fontSize: 14,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{translateX: -50}],
    backgroundColor: Colors.Blue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 5,
  },
  floatingButtonText: {
    color: Colors.Secondary,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    bottom: 90,
    left: '100%',
  },
});

export default NotificationScreen;
