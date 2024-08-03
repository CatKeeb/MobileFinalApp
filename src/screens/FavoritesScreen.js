import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import RestaurantItem from "../components/RestaurantItem";
import styles from "../styles/style";
import { loadFavorites, toggleFavorite } from "../utils/favouriteAsync";
import { useNavigation } from "@react-navigation/native";

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  const loadFavoriteRestaurants = useCallback(async () => {
    const loadedFavorites = await loadFavorites();
    setFavorites(loadedFavorites);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavoriteRestaurants();
    }, [loadFavoriteRestaurants])
  );

  const handleRestaurantPress = (restaurant) => {
    navigation.navigate("RestaurantDetail", { restaurant });
  };

  const handleToggleFavorite = async (restaurant) => {
    try {
      const updatedFavorites = await toggleFavorite(restaurant, favorites);
      setFavorites(updatedFavorites);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleRestaurantPress(item)}>
      <RestaurantItem
        item={item}
        isFavorite={true}
        onToggleFavorite={handleToggleFavorite}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favorite Restaurants</Text>
      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>No favorite restaurants yet.</Text>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

export default FavoritesScreen;
