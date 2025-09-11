import { themas } from "@/global/themes";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.9,
    padding: 15,
  },

  text: {
    color: "#fff",
  },

  link: {
    color: "#0356fe",
    textDecorationLine: "underline"
  },

  error: {
    paddingTop: 8,
    paddingLeft: 6,
    color: themas.Colors.red
  },

  textEnter: {
    color: "#fff",
    fontSize: 40,
  },

  wrapper: {
    // backgroundColor: "blue",
    alignSelf: "stretch",
    alignItems: "flex-start",
  },

  buttonWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 15,
    gap: 15
  },

  input: {
    width: "100%",
    marginBottom: 15,
    color: "white",
  },
});