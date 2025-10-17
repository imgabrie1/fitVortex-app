import React from "react";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { RussoOne_400Regular } from "@expo-google-fonts/russo-one";
import {
  Geologica_700Bold,
  Geologica_400Regular,
} from "@expo-google-fonts/geologica";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import Routes from "./routes/index.routes";
import { navigationRef } from "@/navigation/RootNavigation";
import { AuthProvider } from "@/contexts/User/UserContext";
import { themas } from "./global/themes";
import { StatusBar } from "react-native";

const MainTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: themas.Colors.background,
    text: themas.Colors.text,
    primary: themas.Colors.primary
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    RobotoRegular: Roboto_400Regular,
    RobotoBold: Roboto_700Bold,
    RussoOne: RussoOne_400Regular,
    GeologicaBold: Geologica_700Bold,
    GeologicaRegular: Geologica_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer theme={MainTheme} ref={navigationRef}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={themas.Colors.background}
      />
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  );
}
