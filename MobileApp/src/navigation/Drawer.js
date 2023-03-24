import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "../screens/Home";
import Terms from "../screens/Terms";
import Account from "../screens/Account";
import StackNavigation from "./StackNavigation";
import { useNavigation } from "@react-navigation/native";
import Password from "../screens/Password";

const Drawer = createDrawerNavigator();

function MyDrawer({ route }) {
  const { reset } = useNavigation;

  const userId = route.params.userId;

  const handleLogout = () => {
    reset({
      index: 0,
      routes: [{ name: "Login" }], // Replace "Login" with the name of your root screen
    });
  };

  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={Home} initialParams={{ userId }} />
      <Drawer.Screen
        name="Profile"
        component={Account}
        initialParams={{ userId }}
      />
      <Drawer.Screen
        name="Password"
        component={Password}
        initialParams={{ userId }}
      />
      <Drawer.Screen name="Terms&Conditions" component={Terms} />
      <Drawer.Screen
        name="Logout"
        component={StackNavigation}
        options={{ headerShown: false }}
        onPress={handleLogout}
      />
    </Drawer.Navigator>
  );
}
export default MyDrawer;
