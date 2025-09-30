import { themas } from "@/global/themes";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themas.Colors.background,
    marginTop: 50,
  },
  infoHeader: {
    fontFamily: "RussoOne",
    fontSize: 16,
    color: themas.Colors.text
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
  blockHeader: {
    flex: 1,
    backgroundColor: themas.Colors.blackTransparent,
    borderWidth: 2,
    borderColor: themas.Colors.neon,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 20,
    gap: 1,
    marginTop: 10,
    marginBottom: 5,
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
  blockSelected: {
    backgroundColor: themas.Colors.primary,
  },
  infoSelected: {
    fontSize: 15,
    fontFamily: "RussoOne",
    color: themas.Colors.lightGray,
  },
  infoWorkoutWrap: {
    paddingBottom: 15,
    borderBottomColor: themas.Colors.gray,
    borderBottomWidth: 0.5,
    gap: 5
  },
});
