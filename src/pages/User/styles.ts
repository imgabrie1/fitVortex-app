import { themas } from "@/global/themes";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const padding_H = 10

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: themas.Colors.background,
    padding: padding_H,
  },
});
