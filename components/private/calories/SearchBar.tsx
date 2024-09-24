import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Text,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../../../constants/Colors';
import axios from 'axios';
import {Server} from '../../../constants/Configs';
import {useNavigation} from '@react-navigation/native';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  // Debounce function to delay search requests
  const debounce = (func, delay) => {
    let debounceTimer;
    return (...args) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Function to fetch search results
  const fetchSearchResults = () => {
    if (query.length > 0) {
      setIsLoading(true);
      axios
        .get(`${Server}/api/search/food/${query}`)
        .then(response => {
          setResults(response.data);
          setShowDropdown(true);
        })
        .catch(error => {
          console.error('Error fetching search results:', error);
          setShowDropdown(false);
        })
        .finally(() => setIsLoading(false));
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  };

  // Create a debounced version of the search function
  const debouncedFetchSearchResults = debounce(fetchSearchResults, 1000); // 1 second debounce

  useEffect(() => {
    if (query.length > 3) {
      debouncedFetchSearchResults();
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }, [query]);

  const handleSelectItem = item => {
    navigation.navigate('Food_Details', {foodId: item._id});
    setShowDropdown(false);
    clearSearch();
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
  };

  const renderDropdownItem = ({item}) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => handleSelectItem(item)}>
      <Text style={styles.dropdownCategory}>{item.Category}</Text>
      <Text style={styles.dropdownText}>{item.Description.toLowerCase()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.searchContainer}>
      <View style={[styles.header, {paddingTop: 10}]}>
        <TextInput
          placeholder="Add a meal"
          style={styles.searchBar}
          placeholderTextColor={Colors.TextSecondary}
          value={query}
          onChangeText={text => setQuery(text)}
          onFocus={() => query.length > 0 && setShowDropdown(true)}
        />
        {query !== '' && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
            <Ionicons name="close-circle" size={30} color={Colors.Blue} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.cameraIcon}>
          <Ionicons name="camera-outline" size={35} color={Colors.Secondary} />
        </TouchableOpacity>
      </View>

      {query.length > 0 && (
        <Modal
          visible={showDropdown}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDropdown(false)}>
          <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
            <View style={styles.modalBackground} />
          </TouchableWithoutFeedback>

          <View style={styles.dropdownContainer}>
            {isLoading ? (
              <ActivityIndicator
                size="large"
                color={Colors.Blue}
                style={styles.loader}
              />
            ) : results.length > 0 ? (
              <FlatList
                data={results}
                renderItem={renderDropdownItem}
                keyExtractor={item => item._id}
                style={styles.dropdown}
              />
            ) : (
              <Text style={{padding: 10, color: Colors.Secondary}}>
                No results found.
              </Text>
            )}
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    zIndex: 1,
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.Primary,
  },
  searchBar: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.CardBorder,
    borderRadius: 25,
    paddingHorizontal: 15,
    backgroundColor: Colors.Primary,
    color: Colors.Secondary,
    fontSize: 18,
  },
  cameraIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
    marginLeft: 10,
    backgroundColor: Colors.CardBackground,
    borderRadius: 100,
    padding: 8,
  },
  clearIcon: {
    position: 'absolute',
    right: 90,
    top: 20,
    padding: 5,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    maxHeight: 300,
    backgroundColor: Colors.Primary,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.CardBorder,
    shadowColor: Colors.Primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  dropdown: {
    paddingHorizontal: 2,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.CardBorder,
  },
  dropdownCategory: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.Secondary,
  },
  dropdownText: {
    fontSize: 15,
    color: Colors.Secondary,
  },
  loader: {
    marginTop: 20,
  },
});

export default SearchBar;
