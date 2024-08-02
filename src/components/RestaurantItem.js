import React from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles, { imageSize } from "../styles/style";

const RestaurantItem = ({ item, isFavorite, onToggleFavorite }) => {
  return (
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
        <TouchableOpacity
          style={styles.heartContainer}
          onPress={() => onToggleFavorite(item)}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color="tomato"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default RestaurantItem;
