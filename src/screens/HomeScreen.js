import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Image,
  FlatList,
  Alert,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { searchRestaurants } from "../services/api";
import * as Location from "expo-location";
import { Linking } from "react-native";
import { loadFavorites, toggleFavorite } from "../utils/favouriteAsync";
import { useFocusEffect } from "@react-navigation/native";
import styles from "../styles/style";
import RestaurantItem from "../components/RestaurantItem";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const imageSize = width * 0.2;

const HomeScreen = () => {
  const [term, setTerm] = useState("");
  const [location, setLocation] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    getCurrentLocation();
    loadFavoriteRestaurants();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavoriteRestaurants();
    }, [])
  );

  const handleRestaurantPress = (restaurant) => {
    navigation.navigate("RestaurantDetail", { restaurant });
  };

  const loadFavoriteRestaurants = async () => {
    const loadedFavorites = await loadFavorites();
    setFavorites(loadedFavorites);
  };

  const handleToggleFavorite = async (restaurant) => {
    try {
      const updatedFavorites = await toggleFavorite(restaurant, favorites);
      setFavorites(updatedFavorites);
    } catch (error) {
      Alert.alert("Error", "Failed to update favorite");
    }
  };

  const getCurrentLocation = async () => {
    setIsFetchingLocation(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Location permission is required to use this feature. Please enable it in your device settings.",
        [
          { text: "OK" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
      setIsFetchingLocation(false);
      return;
    }

    try {
      setLoading(true);
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      await reverseGeocode(currentLocation);
    } catch (error) {
      console.error("Error getting current location:", error);
      Alert.alert(
        "Error",
        "Failed to get your current location. Please enter it manually."
      );
    } finally {
      setLoading(false);
      setIsFetchingLocation(false);
    }
  };

  const reverseGeocode = async (location) => {
    try {
      const { latitude, longitude } = location.coords;
      let result = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (result.length > 0) {
        const { formattedAddress } = result[0];

        if (formattedAddress) {
          setLocation(formattedAddress);
          console.log("Formatted Address:", formattedAddress);
        } else {
          throw new Error("No formatted address found");
        }
      } else {
        throw new Error("No results found");
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      Alert.alert(
        "Error",
        "Failed to get your precise location. Please enter it manually."
      );
    }
  };

  const handleSearchRestaurants = async (resetSearch = true) => {
    if (!location.trim()) {
      Alert.alert("Error", "Please enter a location");
      return;
    }

    if (loading) return;

    setLoading(true);
    if (resetSearch) {
      setRestaurants([]);
      setOffset(0);
      setHasMore(true);
    }

    try {
      const newOffset = resetSearch ? 0 : offset;
      const response = await searchRestaurants(term, location, newOffset);
      const newRestaurants = response.data.businesses.map(
        (business, index) => ({
          ...business,
          uniqueKey: `${business.id}-${newOffset + index}`,
        })
      );

      setRestaurants((prevRestaurants) =>
        resetSearch ? newRestaurants : [...prevRestaurants, ...newRestaurants]
      );

      setOffset((prevOffset) => newOffset + newRestaurants.length);
      setHasMore(newRestaurants.length === 20);
    } catch (error) {
      console.error("Failed to search restaurants", error);
      Alert.alert("Error", `Failed to search restaurants: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      handleSearchRestaurants(false);
    }
  }, [loading, hasMore, term, location, offset]);

  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleRestaurantPress(item)}>
      <RestaurantItem
        item={item}
        isFavorite={favorites.some((fav) => fav.id === item.id)}
        onToggleFavorite={handleToggleFavorite}
      />
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loading || restaurants.length === 0) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="large" color="tomato" />
      </View>
    );
  };

  const renderListEmptyComponent = () => {
    if (loading && restaurants.length === 0) {
      return (
        <View style={styles.emptyList}>
          <ActivityIndicator size="large" color="tomato" />
          <Text style={styles.loadingText}>Searching for restaurants...</Text>
        </View>
      );
    }
    if (restaurants.length === 0) {
      return (
        <View style={styles.emptyList}>
          <Text>No restaurants found. Try a new search!</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search term (e.g., pizza, sushi)"
        value={term}
        onChangeText={setTerm}
      />
      <TextInput
        style={styles.input}
        placeholder="Location (e.g., New York, NY)"
        value={location}
        onChangeText={setLocation}
      />
      <Button title="Search" onPress={() => handleSearchRestaurants(true)} />
      <Button
        title={
          isFetchingLocation ? "Fetching location..." : "Use Current Location"
        }
        onPress={getCurrentLocation}
        disabled={isFetchingLocation}
      />
      <FlatList
        data={restaurants}
        renderItem={renderRestaurantItem}
        keyExtractor={(item) => item.uniqueKey}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderListEmptyComponent}
      />
    </View>
  );
};

export default HomeScreen;
