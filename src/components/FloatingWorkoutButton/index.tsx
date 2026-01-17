import React, { useContext } from "react";
import { TouchableOpacity, View } from "react-native";
import { UserContext } from "@/contexts/User/UserContext";
import AppText from "../AppText";
import { MaterialIcons } from "@expo/vector-icons";
import { navigate } from "@/navigation/RootNavigation";
import { styles } from "./styles";

export const FloatingWorkoutButton = () => {
  const { activeWorkout } = useContext(UserContext);

  if (!activeWorkout) return null;

  const handlePress = () => {
    navigate("BottomRoutes", {
      screen: "Create",
      params: { restore: true, timestamp: Date.now(), ...activeWorkout },
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.content}>
        <AppText style={styles.text}>Continuar treino</AppText>
        <MaterialIcons name="play-arrow" size={20} color="#fff" />
      </View>
    </TouchableOpacity>
  );
};
