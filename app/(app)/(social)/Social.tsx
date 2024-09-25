// @ts-nocheck
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  ToastAndroid,
  Switch,
  RefreshControl, // Import RefreshControl
} from 'react-native';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import {local, Server} from '../../../constants/Configs';
import {UserContext} from '../../../context/UserContext';
import {Colors} from '../../../constants/Colors';
import {useNavigation} from '@react-navigation/native';
import Loader from '../../../components/shared/Loader';

const SocialScreen = () => {
  const {user, setSocialUser,socialUser} = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState({});
  const [imageUpload, setImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [fullScreenPost, setFullScreenPost] = useState(null);
  const [imagePickerModalVisible, setImagePickerModalVisible] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // State to manage refresh
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserData();
    requestPermissions();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [userData]);

  const fetchUserData = () => {
    setLoading(true);
    axios.get(`${Server}/api/social/get-user/${user.SOCIAL_USER}`).then(res => {
      console.log(res.data);
      setSocialUser(res.data);
      setUserData(res.data);
      setProfileVisibility(res.data.prefrences.visibility || false);
      setLoading(false);
    });
  };

  const fetchPosts = () => {
    axios
      .get(`${Server}/api/social/interactions/getPosts/${userData._id}/`)
      .then(res => {
        setPosts(res.data);
        console.log(res.data);
      });
  };

  // Pull-to-refresh function
  const onRefresh = () => {
    setRefreshing(true);
    fetchUserData();
    fetchPosts();
    setRefreshing(false);
  };

  const handleEditProfile = async () => {
    console.log(selectedImage);
    let url = '';
    selectedImage != null
      ? (url = await handleFileUpload(selectedImage))
      : null;
    axios
      .put(`${Server}/api/social/edit-user/${userData._id}`, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        profilePic: selectedImage ? url : null,
        bio: userData.bio,
        profileVisibility: profileVisibility,
      })
      .then(res => {
        setUserData(res.data);
        setEditProfileModalVisible(false);
      })
      .catch(err => {
        setEditProfileModalVisible(false);
        console.error(err);
      });
  };

  const handleFileUpload = async fileUri => {
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });
    try {
      const res = await axios.post(
        `${local}/api/fasst/services/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      console.log(res.data);
      setSelectedImage(res.data.url);
      return res.data.url;
    } catch (err) {
      console.error(err);
      ToastAndroid.show('Failed to upload image', ToastAndroid.LONG);
      setSelectedImage(null);
      return null;
    }
  };

  const requestPermissions = async () => {
    const {status: cameraStatus} =
      await ImagePicker.requestCameraPermissionsAsync();
    const {status: mediaLibraryStatus} =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
      alert('Permission to access camera and media library is required!');
      return false;
    }
    return true;
  };

  const handleImagePicker = async option => {
    // const hasPermissions = await requestPermissions();
    // if (!hasPermissions) return;
    let result;

    if (option === 'camera') {
      result = await ImagePicker.launchCamera({
        allowsEditing: true,
        quality: 1,
      });
    } else if (option === 'gallery') {
      result = await ImagePicker.launchImageLibrary({
        allowsEditing: true,
        quality: 1,
      });
    }

    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
      setImagePickerModalVisible(false);
    }
  };

  const handleChangeProfilePicture = () => {
    setImagePickerModalVisible(true);
  };

  const handleSelectPhoto = () => {
    setImagePickerModalVisible(true);
  };

  const handlePost = async () => {
    setLoading(true);
    const url = await handleFileUpload(selectedImage)
    axios
      .post(`${Server}/api/social/interactions/post`, {
        socialUserId: userData._id,
        caption: caption,
        image: url,
      })
      .then(res => {
        if (res.status === 201) {
          setPosts([...posts, res.data]);
          ToastAndroid.show('Posted', ToastAndroid.SHORT);
          setLoading(false);
          setCaption('');
          setSelectedImage(null);
          setModalVisible(false);
        }
      })
      .catch(err => {
        setLoading(false);
        console.error(err);
      });
  };

  const handlePostPress = post => {
    setFullScreenPost(post);
  };

  return (
    <>
      {loading && <Loader />}
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={styles.profileSection}>
            <TouchableOpacity onPress={() => setProfileModalVisible(true)}>
              <Image
                source={{uri: userData.profilePic}}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <View style={styles.profileStats}>
              <TouchableOpacity style={styles.gymPointsButton}>
                <Text style={styles.gymPointsText}>{user.GYM_POINTS}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bioSection}>
            <Text
              style={
                styles.fullName
              }>{`${userData.firstName} ${userData.lastName}`}</Text>
            <Text style={styles.bio}>@ {userData.username}</Text>
            <Text style={styles.bio}>{userData.bio}</Text>
          </View>

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => setEditProfileModalVisible(true)}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>

          <View style={styles.postGridHeader}>
            <TouchableOpacity style={styles.gridToggle}></TouchableOpacity>
          </View>

          <FlatList
            style={{marginBottom: 90}}
            data={posts}
            renderItem={({item}) => (
              <TouchableOpacity
                key={item._id}
                style={styles.post}
                onPress={() => handlePostPress(item)}>
                <Image
                  source={{uri: item.media.image}}
                  style={styles.postImage}
                />
              </TouchableOpacity>
            )}
            numColumns={3}
            scrollEnabled={false}
          />
        </ScrollView>

        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setModalVisible(true)}>
          <Ionicons
            name="plus-circle-outline"
            size={24}
            color={Colors.Secondary}
          />
        </TouchableOpacity>

        {/* New Post Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => {
                  setCaption('');
                  setSelectedImage(null);
                  setModalVisible(false);
                }}>
                <Ionicons
                  name="close-circle-outline"
                  size={24}
                  color={Colors.Secondary}
                />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>New Post</Text>
              <TouchableOpacity onPress={handlePost} disabled={!selectedImage}>
                <Text
                  style={[
                    styles.modalShareText,
                    !selectedImage && {color: Colors.TextSecondary},
                  ]}>
                  Post
                </Text>
              </TouchableOpacity>
            </View>
            {loading ? (
              <Loader title="Uploading" />
            ) : (
              <>
                <TouchableOpacity
                  style={
                    selectedImage
                      ? styles.uploadArea
                      : [
                          styles.uploadArea,
                          {justifyContent: 'center', alignItems: 'center'},
                        ]
                  }
                  onPress={handleSelectPhoto}>
                  {selectedImage ? (
                    <Image
                      source={{uri: selectedImage}}
                      style={styles.uploadedImage}
                    />
                  ) : (
                    <>
                      <Ionicons
                        name="camera"
                        size={48}
                        color={Colors.TextSecondary}
                      />
                      <Text style={styles.uploadText}>Tap to add photo</Text>
                    </>
                  )}
                </TouchableOpacity>
                <TextInput
                  style={styles.captionInput}
                  placeholder="Enter a caption..."
                  placeholderTextColor={Colors.TextSecondary}
                  multiline
                  value={caption}
                  onChangeText={setCaption}
                />
              </>
            )}
          </View>
        </Modal>

        {/* Full-Screen Post View Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={!!fullScreenPost}
          onRequestClose={() => setFullScreenPost(null)}>
          <TouchableOpacity
            style={styles.fullScreenModal}
            activeOpacity={1}
            onPress={() => setFullScreenPost(null)}>
            {fullScreenPost && (
              <>
                <Image
                  source={{uri: fullScreenPost.media.image}}
                  style={styles.fullScreenImage}
                />
                <View style={styles.fullScreenCaption}>
                  <Text style={styles.fullScreenCaptionText}>
                    {fullScreenPost.media.caption}
                  </Text>
                </View>
              </>
            )}
          </TouchableOpacity>
        </Modal>

        {/* Profile Picture Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={profileModalVisible}
          onRequestClose={() => setProfileModalVisible(false)}>
          <TouchableOpacity
            style={styles.profileModalOverlay}
            activeOpacity={1}
            onPress={() => setProfileModalVisible(false)}>
            <Image
              source={{uri: userData.profilePic}}
              style={styles.largeProfileImage}
            />
          </TouchableOpacity>
        </Modal>

        {/* Edit Profile Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={editProfileModalVisible}
          onRequestClose={() => setEditProfileModalVisible(false)}>
          <View style={styles.editProfileModalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setEditProfileModalVisible(false)}>
                <Ionicons
                  name="close-circle-outline"
                  size={24}
                  color={Colors.Secondary}
                />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity
                disabled={imageUpload}
                onPress={handleEditProfile}>
                 <Ionicons
                  name="checkmark"
                  size={24}
                  color={imageUpload ? Colors.CardBackground : Colors.Blue}
                /> 
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.editProfileForm}>
              <TouchableOpacity
                style={styles.changeProfilePicture}
                onPress={handleChangeProfilePicture}>
                {imageUpload ? (
                  <ActivityIndicator
                    color={Colors.Blue}
                    style={[
                      styles.editProfileImage,
                      {
                        backgroundColor: Colors.CardBackground,
                        borderRadius: 100,
                      },
                    ]}
                  />
                ) : (
                  <Image
                    source={{
                      uri: selectedImage ? selectedImage : userData.profilePic,
                    }}
                    style={styles.editProfileImage}
                  />
                )}
                <Text style={styles.changeProfilePictureText}>
                  Change Profile Picture
                </Text>
              </TouchableOpacity>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput
                  style={styles.input}
                  value={userData.username}
                  onChangeText={text =>
                    setUserData({...userData, username: text})
                  }
                  placeholderTextColor={Colors.TextSecondary}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={userData.firstName}
                  onChangeText={text =>
                    setUserData({...userData, firstName: text})
                  }
                  placeholderTextColor={Colors.TextSecondary}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={userData.lastName}
                  onChangeText={text =>
                    setUserData({...userData, lastName: text})
                  }
                  placeholderTextColor={Colors.TextSecondary}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.bioInput]}
                  value={userData.bio}
                  onChangeText={text => setUserData({...userData, bio: text})}
                  multiline
                  placeholderTextColor={Colors.TextSecondary}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Profile Visibility</Text>
                <Switch
                  value={profileVisibility}
                  onValueChange={value => setProfileVisibility(value)}
                  trackColor={{
                    false: Colors.TextSecondary,
                    true: Colors.Blue,
                  }}
                  thumbColor={profileVisibility ? Colors.Blue : Colors.Error}
                />
              </View>
            </ScrollView>
          </View>
        </Modal>

        {/* Image Picker Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={imagePickerModalVisible}
          onRequestClose={() => setImagePickerModalVisible(false)}>
          <View style={styles.bottomModalContainer}>
            <View style={styles.bottomModal}>
              <Text style={styles.bottomModalTitle}>Select Image Source</Text>
              <TouchableOpacity
                id="camera"
                style={styles.bottomModalOption}
                onPress={() => handleImagePicker('camera')}>
                <Ionicons
                  name="camera-outline"
                  size={24}
                  color={Colors.Secondary}
                  style={styles.iconStyle}
                />
                <Text style={styles.bottomModalOptionText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                id="gallery"
                style={styles.bottomModalOption}
                onPress={() => handleImagePicker('gallery')}>
                <Ionicons
                  name="file-image-outline"
                  size={24}
                  color={Colors.Secondary}
                  style={styles.iconStyle}
                />
                <Text style={styles.bottomModalOptionText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                id="cancel"
                style={[
                  styles.bottomModalOption,
                  {justifyContent: 'center', marginTop: 10},
                ]}
                onPress={() => setImagePickerModalVisible(false)}>
                <Ionicons
                  name="close-circle-outline"
                  size={24}
                  color={Colors.Error}
                  style={styles.iconStyle}
                />
                <Text
                  style={[styles.bottomModalOptionText, {color: Colors.Error}]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Primary,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.CardBorder,
  },
  headerUsername: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.TextPrimary,
  },
  profileSection: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileStats: {
    flexDirection: 'row',
    marginTop: 10,
  },
  gymPointsButton: {
    backgroundColor: Colors.Blue,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  gymPointsText: {
    color: Colors.Secondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bioSection: {
    paddingHorizontal: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  fullName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.TextPrimary,
  },
  bio: {
    fontSize: 14,
    color: Colors.TextSecondary,
    marginTop: 5,
    textAlign: 'center',
  },
  editProfileButton: {
    marginHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.CardBorder,
    alignItems: 'center',
    backgroundColor: Colors.CardBackground,
  },
  editProfileText: {
    color: Colors.TextPrimary,
    fontWeight: 'bold',
  },
  postGridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.CardBorder,
    marginTop: 15,
  },
  gridToggle: {
    paddingVertical: 10,
    flex: 1,
    alignItems: 'center',
  },
  post: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 1,
  },
  postImage: {
    flex: 1,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 60,
    backgroundColor: Colors.Blue,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalContent: {
    flex: 1,
    backgroundColor: Colors.Primary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.CardBorder,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.TextPrimary,
  },
  modalShareText: {
    color: Colors.Blue,
    fontWeight: 'bold',
  },
  captionInput: {
    padding: 15,
    fontSize: 16,
    color: Colors.TextPrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.CardBorder,
  },
  uploadArea: {
    flex: 1,
    margin: 10,
    marginBottom: 0,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  uploadText: {
    color: Colors.TextSecondary,
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  fullScreenCaption: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  fullScreenCaptionText: {
    color: Colors.TextPrimary,
    fontSize: 16,
    textAlign: 'center',
  },
  profileModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeProfileImage: {
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  editProfileModalContent: {
    flex: 1,
    backgroundColor: Colors.Primary,
  },
  editProfileForm: {
    padding: 20,
  },
  changeProfilePicture: {
    alignItems: 'center',
    marginBottom: 20,
  },
  editProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  changeProfilePictureText: {
    color: Colors.Blue,
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: Colors.TextSecondary,
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.CardBorder,
    color: Colors.TextPrimary,
    fontSize: 16,
    paddingVertical: 5,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  bottomModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomModal: {
    backgroundColor: Colors.CardBackground,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.TextPrimary,
    marginBottom: 15,
  },
  bottomModalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconStyle: {
    marginRight: 10,
  },
  bottomModalOptionText: {
    fontSize: 16,
    color: Colors.TextPrimary,
  },
});

export default SocialScreen;
