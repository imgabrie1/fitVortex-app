import { themas } from "@/global/themes";
import { Dimensions, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.88)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#ffffffd1",
    borderRadius: 14,
    paddingTop: 20,
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
    paddingLeft: 10,
  },
  message: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  dividerHorizontal: {
    height: 1,
    backgroundColor: "#C7C7CC",
    width: "100%",
  },

  buttonWrapper: {
    flexDirection: "row",
    height: 50,
    width: "100%",
  },

  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: themas.Colors.secondary,
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
});
