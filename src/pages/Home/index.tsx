import AppText from "@/components/AppText";
import { UserContext } from "@/contexts/User/UserContext";
import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { style } from "./styles";
import WorkoutDay from "@/components/WorkoutDay";

const Home = () => {
  const { logout } = useContext(UserContext);

  const onLogout = async () => {
    await logout();
  };

  return (
    <View style={style.container}>
      <WorkoutDay />
    </View>
  );
};

export default Home;
