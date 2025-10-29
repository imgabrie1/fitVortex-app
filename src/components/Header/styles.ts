import { themas } from "@/global/themes";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: themas.Colors.background,
    height: height * 0.05,
    alignItems: "flex-start",
    display: "flex",
    justifyContent: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginLeft: 25,
  },
  logo: {
    fontSize: 28,
    color: "#fff",
    letterSpacing: 1,
  },
  fit: {
    fontFamily: "GeologicaBold",
  },
  vortexContainer: {
    flexDirection: "row",
    position: "relative",
  },
  v: {
    fontSize: 34,
    color: themas.Colors.led,
    textShadowColor: themas.Colors.led,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    fontFamily: "GeologicaBold",
    position: "absolute",
    left: 5,
    top: -4,
    zIndex: 2,
  },
  ortex: {
    color: "#fff",
    fontFamily: "GeologicaBold",
    fontSize: 28,
    marginLeft: 20,
  },
});