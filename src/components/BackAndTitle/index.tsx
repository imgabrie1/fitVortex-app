import React from "react";
import { View } from "react-native";
import { styles } from "./styles";
import AppText from "../AppText";
import { MaterialIcons } from "@expo/vector-icons";

interface BackAndTitleProps {
  onBack: () => void;
  title: any;
}

const BackAndTitle = ({ onBack, title }: BackAndTitleProps) => {
  return (
    <View style={styles.nameAndBackWrap}>
      <MaterialIcons
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        delayLongPress={0}
        name="arrow-back"
        size={24}
        color="white"
        onPress={onBack}
      />
      <AppText style={styles.name}>{title.toUpperCase()}</AppText>
      <View style={{ width: 24 }} />
    </View>
  );
};

export default BackAndTitle;
