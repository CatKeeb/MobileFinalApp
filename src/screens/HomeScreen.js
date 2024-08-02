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
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Linking } from "react-native";
import { loadFavorites, toggleFavorite } from "../utils/favouriteAsync";
import { useFocusEffect } from "@react-navigation/native";
import styles from "../styles/style";

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

  useEffect(() => {
    getCurrentLocation();
    loadFavoriteRestaurants();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavoriteRestaurants();
    }, [])
  );

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
    <TouchableOpacity
      style={styles.cellContainer}
      onPress={() =>
        Alert.alert("Restaurant Details", `You selected ${item.name}`)
      }
    >
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          {item.image_url ? (
            <Image
              source={{ uri: item.image_url }}
              style={styles.restaurantImage}
            />
          ) : (
            <View style={[styles.restaurantImage, styles.placeholderImage]}>
              <Ionicons
                name="restaurant-outline"
                size={imageSize * 0.5}
                color="#888"
              />
            </View>
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.restaurantTitle}>{item.name}</Text>
          <Text style={styles.addressText}>
            {`${item.location.address1}, ${item.location.city}`}
          </Text>
          <View style={styles.detailContainer}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="gold" />
              <Text style={styles.ratingText}>{item.rating}</Text>
              <Text style={styles.reviewCount}>
                ({item.review_count} reviews)
              </Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Price: </Text>
              {item.price ? (
                <Text style={styles.priceCategory}>
                  {Array(item.price.length)
                    .fill()
                    .map((_, i) => (
                      <Ionicons
                        key={i}
                        name="logo-usd"
                        size={16}
                        color="green"
                      />
                    ))}
                </Text>
              ) : (
                <Text style={styles.priceCategory}>-</Text>
              )}
            </View>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#bbb" />
        <TouchableOpacity
          style={styles.heartContainer}
          onPress={() => handleToggleFavorite(item)}
        >
          <Ionicons
            name={
              favorites.some((fav) => fav.id === item.id)
                ? "heart"
                : "heart-outline"
            }
            size={24}
            color="tomato"
          />
        </TouchableOpacity>
      </View>
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
      <Button title="Use Current Location" onPress={getCurrentLocation} />
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
