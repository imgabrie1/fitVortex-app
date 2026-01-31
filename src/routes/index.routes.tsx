import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, ActivityIndicator } from "react-native";
import { UserContext } from "@/contexts/User/UserContext";

import Login from "@/pages/Login";
import BottomRoutes from "./BottomRoutes/bottom.routes";
import Register from "@/pages/Register";
import StartApp from "@/pages/StartApp";
import { themas } from "@/global/themes";

const Stack = createStackNavigator();

const AuthRoutes = () => (
  <Stack.Navigator
    initialRouteName="StartApp"
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: "#fff" },
      animation: "fade",
    }}
  >
    <Stack.Screen name="StartApp" component={StartApp} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} />
  </Stack.Navigator>
);

const AppRoutes = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BottomRoutes" component={BottomRoutes} />
  </Stack.Navigator>
);

const LoadingScreen = () => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: themas.Colors.background,
    }}
  >
    <ActivityIndicator size="large" color={themas.Colors.primary} />
  </View>
);

export const Routes = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <LoadingScreen />;
  }

  return user ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
