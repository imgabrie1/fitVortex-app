import { themas } from "@/global/themes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: themas.Colors.background,
    borderRadius: 20,
    padding: 24,
    width: "90%",
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: themas.Colors.text,
  },
  closeButton: {
    padding: 4,
  },

  tabsContainer: {
    flexDirection: "row",
    backgroundColor: themas.Colors.alternativeBlocks,
    borderRadius: 10,
    padding: 4,
    gap: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: themas.Colors.secondary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: themas.Colors.gray,
  },
  tabTextActive: {
    color: "#FFFFFF",
  },

  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    gap: 12,
    paddingBottom: 8,
  },
  sectionCard: {
    backgroundColor: themas.Colors.background,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: themas.Colors.text,
    flex: 1,
  },
  sectionBadge: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
    marginLeft: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: themas.Colors.lightGray,
  },
  rowLabel: {
    fontSize: 13,
    color: themas.Colors.gray,
    flex: 1,
    paddingRight: 8,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: themas.Colors.text,
  },
  emptyText: {
    fontSize: 13,
    color: themas.Colors.gray,
    fontStyle: "italic",
  },
  okButton: {
    backgroundColor: themas.Colors.secondary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  okButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  subsection: {
    marginTop: 8,
  },
  subsectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: themas.Colors.gray,
    letterSpacing: 1,
    marginBottom: 4,
    marginTop: 8,
  },
});
