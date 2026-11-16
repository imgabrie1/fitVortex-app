import { themas } from "@/global/themes";
import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
  textButton: {
    color: themas.Colors.text,
    fontSize: 20,
    fontFamily: "GeologicaBold",
    textAlign: "center",
    textAlignVertical: "center",
    flexShrink: 1,
    lineHeight: 22,
  },
  button: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: themas.Colors.primary,
    borderRadius: 18,
  },
});
