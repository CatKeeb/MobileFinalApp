import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadFavorites, toggleFavorite } from "../src/utils/favouriteAsync";

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

describe("Favorites Utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("loadFavorites", () => {
    it("should return an empty array when no favorites are stored", async () => {
      AsyncStorage.getItem.mockResolvedValue(null);

      const favorites = await loadFavorites();
      expect(favorites).toEqual([]);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("favorites");
    });

    it("should return parsed favorites when they exist", async () => {
      const mockFavorites = [{ id: "1", name: "Test Restaurant" }];
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockFavorites));

      const favorites = await loadFavorites();
      expect(favorites).toEqual(mockFavorites);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("favorites");
    });
  });

  describe("toggleFavorite", () => {
    const mockRestaurant = { id: "1", name: "Test Restaurant" };

    beforeEach(() => {
      AsyncStorage.setItem.mockResolvedValue(null);
    });

    it("should add a restaurant to favorites if not already present", async () => {
      const currentFavorites = [];
      const newFavorites = await toggleFavorite(
        mockRestaurant,
        currentFavorites
      );

      expect(newFavorites).toEqual([mockRestaurant]);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "favorites",
        JSON.stringify([mockRestaurant])
      );
    });

    it("should remove a restaurant from favorites if already present", async () => {
      const currentFavorites = [mockRestaurant];
      const newFavorites = await toggleFavorite(
        mockRestaurant,
        currentFavorites
      );

      expect(newFavorites).toEqual([]);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "favorites",
        JSON.stringify([])
      );
    });

    it("should throw an error if AsyncStorage.setItem fails", async () => {
      AsyncStorage.setItem.mockRejectedValue(new Error("Test error"));

      await expect(toggleFavorite(mockRestaurant, [])).rejects.toThrow(
        "Failed to save favorite"
      );
    });

    it("should not modify other favorites when adding a new one", async () => {
      const existingFavorite = { id: "2", name: "Existing Restaurant" };
      const currentFavorites = [existingFavorite];
      const newFavorites = await toggleFavorite(
        mockRestaurant,
        currentFavorites
      );

      expect(newFavorites).toEqual([existingFavorite, mockRestaurant]);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "favorites",
        JSON.stringify([existingFavorite, mockRestaurant])
      );
    });

    it("should not modify other favorites when removing one", async () => {
      const otherFavorite = { id: "2", name: "Other Restaurant" };
      const currentFavorites = [mockRestaurant, otherFavorite];
      const newFavorites = await toggleFavorite(
        mockRestaurant,
        currentFavorites
      );

      expect(newFavorites).toEqual([otherFavorite]);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "favorites",
        JSON.stringify([otherFavorite])
      );
    });
  });
});
