import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Routes from "./routes/index.routes";
import { navigationRef } from "@/navigation/RootNavigation";
import { AuthProvider } from "@/contexts/AuthContext";

export default function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  );
}
