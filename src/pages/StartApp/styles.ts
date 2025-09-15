import { themas } from "@/global/themes";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const style = StyleSheet.create({
  container: {
    flex: 1,
    width: width * 1,
    backgroundColor: themas.Colors.background,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 110,
    paddingBottom: 120,
  },

  buttonWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: width * 0.4,
    height: height / 15,
    gap: 15,
  },

  button: {
    justifyContent: "center",
    alignItems: "center",
  },

  buttonTextWrapper: {
    display: "flex",
    alignItems: "center",
    height: height * 0.3,
    width: width * 0.8,
  },

  welcomeWrapper: {
    width: "100%",
    height: "80%",
    gap: 20
  },

  text: {
    fontSize: 45,
    fontFamily: "RussoOne",
  },


});
