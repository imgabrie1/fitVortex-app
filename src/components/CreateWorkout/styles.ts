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
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 50,
  },
  name: {
    fontSize: 20,
    fontFamily: "GeologicaBold",
    color: themas.Colors.text,
  },

  styledButton: {
    marginTop: 25,
  },
});
