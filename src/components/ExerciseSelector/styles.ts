import { StyleSheet } from "react-native";
import { themas } from "@/global/themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themas.Colors.background,
  },
  nameAndFilter: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingRight: 10,
  },
  filter: {
    paddingBottom: 10,
  },
  activeFilterDeleteWrapper: {
    gap: 8,
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  activeFilter: {
    backgroundColor: themas.Colors.blocks,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
});
