import { themas } from "@/global/themes";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");


export const style = StyleSheet.create({
  textButton: {
    color: "white",
    fontSize: 20,
    fontFamily: "RussoOne"
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: themas.Colors.primary,
    borderRadius: 10,
  },
});
