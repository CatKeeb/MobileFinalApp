import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RestaurantDetailScreen = ({ route }) => {
  const { restaurant } = route.params;

  const openMap = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${restaurant.coordinates.latitude},${restaurant.coordinates.longitude}`;
    Linking.openURL(url);
  };

  const callRestaurant = () => {
    Linking.openURL(`tel:${restaurant.phone}`);
  };

  const renderInfoRow = (icon, label, color, value) => (
    <View style={styles.infoRow}>
      <View style={styles.iconLabelContainer}>
        <Ionicons name={icon} size={20} color={color} />
        <Text style={styles.label}>{label}:</Text>
      </View>
      <Text style={styles.value}>{value || "-"}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: restaurant.image_url }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{restaurant.name}</Text>
        {renderInfoRow("star", "Rating", "gold", restaurant.rating)}
        {renderInfoRow("logo-usd", "Price", "green", restaurant.price)}
        {renderInfoRow(
          "restaurant",
          "Category",
          "tomato",
          restaurant.categories.map((cat) => cat.title).join(", ")
        )}
        {renderInfoRow(
          "location",
          "Location",
          "red",
          `${restaurant.location.address1}, ${restaurant.location.city}`
        )}
        {renderInfoRow("call", "Phone", "blue", restaurant.phone)}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={openMap}>
            <Ionicons name="map" size={24} color="white" />
            <Text style={styles.buttonText}>View on Map</Text>
          </TouchableOpacity>
          {restaurant.phone && (
            <TouchableOpacity style={styles.button} onPress={callRestaurant}>
              <Ionicons name="call" size={24} color="white" />
              <Text style={styles.buttonText}>Call</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  iconLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 110,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  value: {
    fontSize: 16,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "tomato",
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default RestaurantDetailScreen;
