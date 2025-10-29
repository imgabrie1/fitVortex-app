import { themas } from "@/global/themes";
import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
  container: {
    backgroundColor: themas.Colors.blocks,
    padding: 10,
    margin: 10,
    borderRadius: 8
  },
  name: {
    fontFamily: "GeologicaBold"
  },
  text: {
    color: themas.Colors.text,
    fontFamily: "GeologicaRegular"
  }
});
