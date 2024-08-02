import AsyncStorage from "@react-native-async-storage/async-storage";

export const loadFavorites = async () => {
  try {
    const storedFavorites = await AsyncStorage.getItem("favorites");
    return storedFavorites !== null ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.error("Error loading favorites:", error);
    return [];
  }
};

export const toggleFavorite = async (restaurant, currentFavorites) => {
  try {
    const newFavorites = [...currentFavorites];
    const index = newFavorites.findIndex((fav) => fav.id === restaurant.id);

    if (index !== -1) {
      newFavorites.splice(index, 1);
    } else {
      newFavorites.push(restaurant);
    }

    await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
    return newFavorites;
  } catch (error) {
    console.error("Error saving favorite:", error);
    throw new Error("Failed to save favorite");
  }
};
