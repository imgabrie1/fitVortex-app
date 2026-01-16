import { StyleSheet } from "react-native";
import { themas } from "@/global/themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: themas.Colors.background,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: themas.Colors.text,
  },
  toggleButton: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: themas.Colors.gray,
    padding: 2,
    justifyContent: "center",
  },
  toggleButtonActive: {
    backgroundColor: themas.Colors.secondary,
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  toggleCircleActive: {
    transform: [{ translateX: 22 }],
  },
  toggleDescription: {
    fontSize: 14,
    color: themas.Colors.gray,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 8,
  },

  modificationsList: {
    flex: 1,
    marginBottom: 20,
  },
  card: {
    backgroundColor: themas.Colors.blocks,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: themas.Colors.gray,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: themas.Colors.text,
  },
  removeButton: {
    padding: 4,
  },

  actionContainer: {
    marginBottom: 12,
  },
  actionLabel: {
    color: themas.Colors.gray,
    marginBottom: 8,
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: themas.Colors.gray,
    alignItems: "center",
  },
  actionButtonActive: {
    backgroundColor: themas.Colors.secondary,
    borderColor: themas.Colors.secondary,
  },
  actionButtonText: {
    color: themas.Colors.gray,
    fontSize: 12,
    fontWeight: "600",
  },
  actionButtonTextActive: {
    color: "white",
  },

  addModificationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: themas.Colors.secondary,
    borderRadius: 8,
    borderStyle: "dashed",
    marginTop: 10,
    marginBottom: 20,
  },
  addModificationText: {
    color: themas.Colors.secondary,
    fontWeight: "600",
    marginLeft: 8,
  },
  emptyListText: {
    color: themas.Colors.gray,
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 20,
  },

  advancedToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: themas.Colors.gray,
    marginBottom: 20,
  },
  advancedToggleText: {
    color: themas.Colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
});
