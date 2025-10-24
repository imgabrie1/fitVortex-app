import { themas } from "@/global/themes";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  nameAndBackWrap: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 15,
    justifyContent: "space-between"
  },
  name: {
    fontSize: 20,
    fontWeight: 700
  },
});
