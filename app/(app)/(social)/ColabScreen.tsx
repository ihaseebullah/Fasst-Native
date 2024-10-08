import React, {useEffect, useState, useRef, useContext} from 'react';
import {
  View,
  Text,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import axios from 'axios';
import {Server} from '../../../constants/Configs';
import {UserContext} from '../../../context/UserContext';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../../../constants/Colors';
import GetLocation from 'react-native-get-location';

const ColabScreen = () => {
  const [initialRegion, setInitialRegion] = useState(null);
  const {user} = useContext(UserContext);
  const mapRef = useRef(null);
  const [userLocations, setUserLocations] = useState([]);
  const navigation = useNavigation();

  // Fetch user locations periodically
  useEffect(() => {
    const fetchUserLocations = async () => {
      if (user && user.SOCIAL_USER) {
        try {
          const res = await axios.get(
            `${Server}/api/social/interactions/get/location/${user.SOCIAL_USER}/`,
          );
          setUserLocations(res.data);
        } catch (err) {
          console.error('Error fetching user locations:', err);
        }
      }
    };

    const intervalId = setInterval(fetchUserLocations, 10000); // Run every 10 seconds
    return () => clearInterval(intervalId); // Cleanup
  }, [user]);

  useEffect(() => {
    async function getLocation() {
      await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      })
        .then(location => {
          setInitialRegion(location);
        })
        .catch(error => {
          const {code, message} = error;
          console.warn(code, message);
        });
    }
    getLocation();
  }, []);

  // Request location permissions and get current location
  // useEffect(() => {
  //   const requestLocationPermission = async () => {
  //     try {
  //       if (Platform.OS === "ios") {
  //         const authStatus = await Geolocation.requestAuthorization();
  //         if (authStatus === "granted") {
  //           getCurrentLocation();
  //         } else {
  //           console.log("Location permission denied");
  //         }
  //       } else {
  //         const granted = await PermissionsAndroid.request(
  //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  //         );
  //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //           getCurrentLocation();
  //         } else {
  //           console.log("Location permission denied");
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error requesting location permission:", error);
  //     }
  //   };

  //   requestLocationPermission();

  // }, []);

  // Get current location
  // const getCurrentLocation = async () => {
  //   try {
  //     Geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;

  //         const initialRegion = {
  //           latitude,
  //           longitude,
  //           latitudeDelta: 0.0922,
  //           longitudeDelta: 0.0421,
  //         };

  //         setInitialRegion(initialRegion);
  //         updateUserLocation(initialRegion); // Update user location
  //         fitMapToMarkers(latitude, longitude); // Fit map to user locations
  //       },
  //       (error) => {
  //         console.error("Error getting location:", error);
  //       },
  //       { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  //     );
  //   } catch (error) {
  //     console.error("Error in getting location:", error);
  //   }
  // };

  // Update user location on the server
  const updateUserLocation = async location => {
    try {
      await axios.put(
        `${Server}/api/social/interactions/update/location/${user.SOCIAL_USER}/`,
        {location},
      );
    } catch (err) {
      console.error('Error updating location:', err);
    }
  };

  // Fit map to include user locations
  const fitMapToMarkers = (latitude, longitude) => {
    if (mapRef.current) {
      const coordinates = [
        {latitude, longitude},
        ...userLocations.map(user => ({
          latitude: user.latitude,
          longitude: user.longitude,
        })),
      ];
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
        animated: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      {initialRegion ? (
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true}
          followsUserLocation={true}>
          {userLocations
            .filter(location => location.id !== user._id)
            .map(user => (
              <Marker
                key={user.id}
                coordinate={{
                  latitude: user.latitude,
                  longitude: user.longitude,
                }}
                onPress={() =>
                  navigation.navigate('User_Profile', {userId: user.id})
                }>
                <View style={styles.markerContainer}>
                  <View style={styles.markerImageContainer}>
                    <Image
                      source={{uri: user.profilePic}}
                      style={styles.markerImage}
                    />
                  </View>
                  <Text style={styles.markerText}>{user.name}</Text>
                </View>
              </Marker>
            ))}
        </MapView>
      ) : (
        <Text style={styles.infoText}>Fetching location...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.CardBackground,
    borderRadius: 30,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  markerImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.Secondary,
    borderRadius: 25,
    padding: 5,
    width: 50,
    height: 50,
  },
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.Primary,
  },
  markerText: {
    color: Colors.TextPrimary,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    backgroundColor: Colors.CardBackground,
    padding: 2,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  infoText: {
    color: Colors.TextPrimary,
    fontSize: 16,
  },
});

export default ColabScreen;
