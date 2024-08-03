import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import RestaurantDetailScreen from "../screens/RestaurantDetailScreen";
import { SafeAreaView } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Stack.Screen
        name="RestaurantDetail"
        component={RestaurantDetailScreen}
        options={{ title: "Restaurant Details" }}
      />
    </Stack.Navigator>
  );
};

const FavoritesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FavoritesScreen"
        component={FavoritesScreen}
        options={{ title: "Favorites" }}
      />
      <Stack.Screen
        name="RestaurantDetail"
        component={RestaurantDetailScreen}
        options={{ title: "Restaurant Details" }}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Favorites") {
            iconName = focused ? "heart" : "heart-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: [
          {
            display: "flex",
          },
          null,
        ],
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesStack}
        options={({ route }) => ({
          headerShown: false,
        })}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
