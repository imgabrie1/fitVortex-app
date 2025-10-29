import React, { useContext } from "react";
import { Animated, Dimensions, View } from "react-native";
import { styles } from "./styles";
import AppText from "../AppText";
import { AnimationContext } from "@/contexts/Animation/AnimationContext";

const { height } = Dimensions.get("window");
const HEADER_HEIGHT = height * 0.05;

const CustomHeader = () => {
  const { scrollY } = useContext(AnimationContext);

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: headerTranslateY }],
        },
      ]}
    >
      <View style={styles.logoContainer}>
        <AppText style={[styles.logo, styles.fit]}>Fit</AppText>
        <View style={styles.vortexContainer}>
          <AppText style={styles.v}>V</AppText>
          <AppText style={styles.ortex}>ortex</AppText>
        </View>
      </View>
    </Animated.View>
  );
};

export default CustomHeader;