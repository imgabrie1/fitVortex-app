import { StyleSheet } from "react-native";
import { themas } from "@/global/themes";

export const style = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingTop: 78,
    paddingRight: 20,
    alignItems: "flex-end",
  },
  menu: {
    backgroundColor: themas.Colors.isExpandedBlocks,
    borderRadius: 10,
    paddingVertical: 8,
    minWidth: 160,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  optionText: {
    color: "white",
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginHorizontal: 8,
  },
});
