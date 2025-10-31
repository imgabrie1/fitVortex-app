import UserData from "@/components/UserData";
import WorkoutDay from "@/components/WorkoutDay";
import React from "react";
import { Dimensions } from "react-native";
import { styles } from "./styles";

const { height } = Dimensions.get("window");

const User = () => {
  return (
    <WorkoutDay
      ListHeaderComponent={<UserData />}
      contentContainerStyle={{ paddingTop: height * 0.05 }}
    />
  );
};

export default User;
