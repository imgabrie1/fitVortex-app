import { themas } from "@/global/themes";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themas.Colors.background,
    marginTop: 50,
  },
  blocks: {
    flex: 1,
    backgroundColor: themas.Colors.blocks,
    // backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 20,
    gap: 10,
    marginTop: 10,
    marginBottom: 5,
  },

  blockSelected: {
    backgroundColor: themas.Colors.primary,
  },
  name: {
    fontSize: 20,
    fontFamily: "RussoOne",
  },
  infosWrap: {
    gap: 5,
  },
  info: {
    fontSize: 15,
    fontFamily: "RussoOne",
    color: themas.Colors.noSelectColor,
  },
  nameAndBackWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  macrosTitles: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  infoSelected: {
    fontSize: 15,
    fontFamily: "RussoOne",
    color: themas.Colors.lightGray,
  },
});
