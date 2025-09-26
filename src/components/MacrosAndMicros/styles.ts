import { themas } from "@/global/themes";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const padding_H = 14

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: themas.Colors.background,
  },
  blocks: {
    flex: 1,
    backgroundColor: themas.Colors.blocks,
    borderRadius: 10,
    padding: padding_H,
    height: height / 8,
    gap: 10
  },
  name: {
    fontSize: 20,
    fontFamily: "RussoOne"
  },
  infosWrap: {
    // backgroundColor: "red",
    gap: 5
  },
  info: {
    fontSize: 15,
    fontFamily: "RussoOne",
    color: themas.Colors.noSelectColor
  }
});
