import { themas } from "@/global/themes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: themas.Colors.background,
    // backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 50,
    borderColor: themas.Colors.neon,
    borderWidth: 0.5
  },
  nameAndBackWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontFamily: "RussoOne",
    color: themas.Colors.text,
  },

  styledButton: {
    marginTop: 25,
  },
});
