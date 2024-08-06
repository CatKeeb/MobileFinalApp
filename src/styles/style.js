// src/styles/commonStyles.js

import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
export const imageSize = width * 0.2;

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  buttonContainer: {
    marginBottom: 10,
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
    padding: 10,
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
    fontSize: 13,
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
  heartContainer: {
    padding: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "gray",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
  },
});
