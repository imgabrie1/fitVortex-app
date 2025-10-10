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

  nameAndMenuWrap: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
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

  editAndDeleteWrap: {
    position: "absolute",
    width: width * 0.4,
    right: 10,
    top: 25,
    backgroundColor: "#3737376c",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    zIndex: 999,
    elevation: 60,
    shadowColor: themas.Colors.neon,
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
