import React from "react";
import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { RussoOne_400Regular } from "@expo-google-fonts/russo-one";
import { NavigationContainer } from "@react-navigation/native";
import Routes from "./routes/index.routes";
import { navigationRef } from "@/navigation/RootNavigation";
import { AuthProvider } from "@/contexts/AuthContext";

export default function App() {
  const [fontsLoaded] = useFonts({
    RobotoRegular: Roboto_400Regular,
    RobotoBold: Roboto_700Bold,
    RussoOne: RussoOne_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  );
}
