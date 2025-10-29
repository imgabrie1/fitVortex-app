import AppText from "@/components/AppText";
import { UserContext } from "@/contexts/User/UserContext";
import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { style } from "./styles";
import WorkoutDay from "@/components/WorkoutDay";

const { height } = Dimensions.get("window");

const Home = () => {
  const { logout } = useContext(UserContext);

  const onLogout = async () => {
    await logout();
  };

  return (
    <View style={style.container}>
      <WorkoutDay contentContainerStyle={{ paddingTop: height * 0.05 }} />
    </View>
  );
};

export default Home;
