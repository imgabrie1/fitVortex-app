import React, { useContext } from "react";
import { Animated, Dimensions, View } from "react-native";
import { styles } from "./styles";
import AppText from "../AppText";
import { AnimationContext } from "@/contexts/Animation/AnimationContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");
const HEADER_CONTENT_HEIGHT = height * 0.05;

const CustomHeader = () => {
  const { scrollY } = useContext(AnimationContext);
  const insets = useSafeAreaInsets();

  const headerTotalHeight = HEADER_CONTENT_HEIGHT + insets.top;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, headerTotalHeight],
    outputRange: [0, -headerTotalHeight],
    extrapolate: "clamp",
  });

  const headerStyle = {
    transform: [{ translateY: headerTranslateY }],
    height: headerTotalHeight,
    paddingTop: insets.top,
  };

  return (
    <Animated.View style={[styles.container, headerStyle]}>
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