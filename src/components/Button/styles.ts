import { themas } from "@/global/themes";
import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
  textButton: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    width: "80%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: themas.Colors.primary,
    borderRadius: 10,
    shadowColor: themas.Colors.led,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
});
