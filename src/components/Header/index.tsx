import React from "react";
import { View } from "react-native";
import { styles } from "./styles";
import AppText from "../AppText";

const CustomHeader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <AppText style={[styles.logo, styles.fit]}>Fit</AppText>
        <View style={styles.vortexContainer}>
          <AppText style={styles.v}>V</AppText>
          <AppText style={styles.ortex}>ortex</AppText>
        </View>
      </View>
    </View>
  );
};

export default CustomHeader;