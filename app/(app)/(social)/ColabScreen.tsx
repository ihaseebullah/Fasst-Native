import React, {useEffect, useState, useRef, useContext} from 'react';
import {
  View,
  Text,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  ActivityIndicator,
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
  const [mapError, setMapError] = useState(false);
  const [loading, setLoading] = useState(true); 
  const {user} = useContext(UserContext);
  const mapRef = useRef(null);
  const [userLocations, setUserLocations] = useState([]);
  const navigation = useNavigation();

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'App needs access to your location to show the map.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; 
  };

  useEffect(() => {
    const fetchUserLocations = async () => {
      if (user && user.SOCIAL_USER) {
        try {
          const res = await axios.get(
            `${Server}/api/social/interactions/get/location/${user.SOCIAL_USER}/`,
          );
          console.log('User locations:', res.data);
          setUserLocations(res.data);
        } catch (err) {
          console.error('Error fetching user locations:', err);
        }
      }
    };

    const intervalId = setInterval(fetchUserLocations, 10000); 
    return () => clearInterval(intervalId);
  }, [user]);

  useEffect(() => {
    const getLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setMapError(true);
        return;
      }

      await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      })
        .then(location => {
          console.log('Current location:', location);
          setInitialRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          setLoading(false); 
        })
        .catch(error => {
          console.error('Error getting location:', error);
          setMapError(true);
          setLoading(false); 
        });
    };

    getLocation();
  }, []);

  const renderMarkers = () => {
    return userLocations
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
      ));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.Blue} />
        <Text style={styles.infoText}>Fetching location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {mapError ? (
        <Text style={styles.errorText}>
          There was an error loading the map. Please try again later.
        </Text>
      ) : initialRegion ? (
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true}
          followsUserLocation={true}
          onMapReady={() => setMapError(false)} 
          onError={e => {
            console.error('Map Error: ', e.nativeEvent.errorMessage);
            setMapError(true);
          }}>
          {renderMarkers()}
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
  loadingContainer: {
    flex: 1,
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
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ColabScreen;
