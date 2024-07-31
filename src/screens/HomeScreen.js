import React, { useState, useCallback } from "react";
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

const { width } = Dimensions.get("window");
const imageSize = width * 0.2; // 20% of screen width

const HomeScreen = () => {
  const [term, setTerm] = useState("");
  const [location, setLocation] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleSearchRestaurants = async (resetSearch = true) => {
    if (!location.trim()) {
      Alert.alert("Error", "Please enter a location");
      return;
    }

    if (loading) return; // Prevent multiple simultaneous requests

    setLoading(true);
    try {
      const newOffset = resetSearch ? 0 : offset;
      const response = await searchRestaurants(term, location, newOffset);
      const newRestaurants = response.data.businesses.map(
        (business, index) => ({
          ...business,
          uniqueKey: `${business.id}-${newOffset + index}`,
        })
      );

      if (resetSearch) {
        setRestaurants(newRestaurants);
      } else {
        setRestaurants((prevRestaurants) => [
          ...prevRestaurants,
          ...newRestaurants,
        ]);
      }

      setOffset(newOffset + newRestaurants.length);
      setHasMore(newRestaurants.length === 20); // Assuming Yelp API returns 20 results per page
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
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="large" color="tomato" />
      </View>
    );
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
      <Button
        title="Search"
        onPress={() => {
          setOffset(0);
          setHasMore(true);
          handleSearchRestaurants(true);
        }}
      />
      <FlatList
        data={restaurants}
        renderItem={renderRestaurantItem}
        keyExtractor={(item) => item.uniqueKey}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={() => (
          <View style={styles.emptyList}>
            <Text>No restaurants found. Try a new search!</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  loadingFooter: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "#CED0CE",
  },
  emptyList: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },
  cellContainer: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    padding: 10,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    marginRight: 12,
  },
  restaurantImage: {
    width: imageSize,
    height: imageSize,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  restaurantTitle: {
    fontWeight: "600",
    fontSize: 17,
    marginBottom: 6,
  },
  addressText: {
    color: "#888",
    marginBottom: 6,
    fontSize: 14,
  },
  detailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
  },
  reviewCount: {
    marginLeft: 4,
    color: "#888",
    fontSize: 12,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 14,
    color: "#888",
  },
  priceCategory: {
    marginLeft: 5,
    fontSize: 14,
  },
  placeholderImage: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});

export default HomeScreen;
