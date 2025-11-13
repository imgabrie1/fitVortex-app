import WorkoutDay from "@/components/WorkoutDay";
import React from "react";
import { Dimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { style } from "./styles";

const { height } = Dimensions.get("window");

const Home = () => {
  const insets = useSafeAreaInsets();
  const headerHeight = height * 0.05;
  const paddingTop = headerHeight + insets.top;

  return (
    <View style={style.container}>
      <WorkoutDay contentContainerStyle={{ paddingTop }} />
    </View>
  );
};

export default Home;
