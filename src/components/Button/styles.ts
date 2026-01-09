import { themas } from "@/global/themes";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");


export const style = StyleSheet.create({
  textButton: {
    color: themas.Colors.text,
    fontSize: 20,
    fontFamily: "GeologicaBold"
  },
  button: {
    width: "100%",
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: themas.Colors.primary,
    borderRadius: 50,
  },
});
