import UserData from "@/components/UserData";
import WorkoutDay from "@/components/WorkoutDay";
import React from "react";
import { Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

const User = () => {
  const insets = useSafeAreaInsets();
  const headerHeight = height * 0.05;
  const paddingTop = headerHeight + insets.top;

  return (
    <WorkoutDay
      ListHeaderComponent={<UserData />}
      contentContainerStyle={{ paddingTop }}
    />
  );
};

export default User;
