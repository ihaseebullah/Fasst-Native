import React, { useEffect, useState, useRef, useContext } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Location from "react-native-geolocation-service";
import { Colors } from "../../../constants/Colors"; // Adjust the path as necessary
import axios from "axios";
import { Server } from "../../../constants/Configs";
import { UserContext } from "../../../context/UserContext";
import { useNavigation } from "@react-navigation/native";

const ColabScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const { user } = useContext(UserContext);
  const mapRef = useRef(null); // Reference to the MapView
  const [socialUser, setSocialUser] = useState({});
  const [userLocations, setUserLocations] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (user && user.SOCIAL_USER) {
        axios
          .get(
            `${Server}/api/social/interactions/get/location/${user.SOCIAL_USER}/`
          )
          .then((res) => {
            console.log(res.data);
            setUserLocations(res.data);
          })
          .catch((err) => console.error("Error fetching user locations:", err));
      }
    }, 1000 * 10); // Run every second

    return () => clearInterval(intervalId); // Cleanup to prevent memory leaks
  }, [user]); // Dependency on user to start/stop fetching

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        getCurrentLocation();
      } else {
        console.log("Location permission denied");
      }
    };

    requestLocationPermission();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;
      const initialRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setInitialRegion(initialRegion);
      setCurrentLocation({ latitude, longitude });

      axios
        .put(
          `${Server}/api/social/interactions/update/location/${user.SOCIAL_USER}/`,
          { location: initialRegion }
        )
        .then((res) => setSocialUser(res.data))
        .catch((err) => console.error("Error updating location:", err));

      if (mapRef.current) {
        const coordinates = [
          { latitude, longitude },
          ...userLocations.map((user) => ({
            latitude: user.latitude,
            longitude: user.longitude,
          })),
        ];
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    } catch (error) {
      console.error("Error getting location:", error);
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
          customMapStyle={darkMapStyle}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          {userLocations
            .filter((location) => location.id != user._id)
            .map((user) => (
              <Marker
                key={user.id}
                coordinate={{
                  latitude: user.latitude,
                  longitude: user.longitude,
                }}
                onPress={() =>
                  navigation.navigate("User_Profile", { userId: user.id })
                }
              >
                <View style={styles.markerContainer}>
                  <View style={styles.markerImageContainer}>
                    <Image
                      source={{ uri: user.profilePic }}
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
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.CardBackground,
    borderRadius: 30,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  markerImageContainer: {
    alignItems: "center",
    justifyContent: "center",
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
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
    backgroundColor: Colors.CardBackground,
    padding: 2,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  infoContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: Colors.CardBackground,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  infoText: {
    color: Colors.TextPrimary,
    fontSize: 16,
  },
});

const darkMapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#bdbdbd",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#181818",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1b1b1b",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#2c2c2c",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8a8a8a",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#373737",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#3c3c3c",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [
      {
        color: "#4e4e4e",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#000000",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#3d3d3d",
      },
    ],
  },
];

export default ColabScreen;
