import { StyleSheet } from "react-native";
import { themas } from "@/global/themes";

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: themas.Colors.background,
    paddingHorizontal: 20,
    paddingTop: 100, // deixa espaço pra header
  },

  nameAndBackWrap: {
    width: "100%",
    position: "absolute",
    marginLeft: 15,
    top: 25,
    gap: 20,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  name: {
    fontSize: 20,
    fontFamily: "GeologicaBold",
    color: themas.Colors.text,
  },

  styledButton: {
    marginTop: 22,
  },

  styledButtonRed: {
    marginTop: 22,
    backgroundColor: themas.Colors.red
  },

  buttonsWrapper: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
});
