import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import RestaurantDetailScreen from "../screens/RestaurantDetailScreen";
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RestaurantDetail"
        component={RestaurantDetailScreen}
        options={({ route }) => ({ title: route.params.restaurant.name })}
      />
    </Stack.Navigator>
  );
};
export default HomeStack;
