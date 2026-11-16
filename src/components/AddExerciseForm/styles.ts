import { themas } from "@/global/themes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: themas.Colors.background,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  stepperWrapper: {
    marginTop: 24,
    gap: 8,
  },
  stepperLabel: {
    fontSize: 14,
    color: themas.Colors.gray,
    paddingHorizontal: 4,
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: themas.Colors.alternativeBlocks,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: themas.Colors.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    height: 64,
  },
  stepperButton: {
    width: 48,
    height: 48,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themas.Colors.background,
    borderWidth: 1,
    borderColor: themas.Colors.lightGray,
  },
  stepperButtonDisabled: {
    backgroundColor: themas.Colors.alternativeBlocks,
    opacity: 0.5,
  },
  stepperValueWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: themas.Colors.text,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  stepperError: {
    fontSize: 13,
    color: themas.Colors.red,
    paddingHorizontal: 4,
  },

  summaryCard: {
    backgroundColor: themas.Colors.background,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: themas.Colors.secondary,
    marginTop: 16,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: themas.Colors.gray,
  },
  summaryBadge: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  summaryBadgeUnilateral: {
    backgroundColor: themas.Colors.secondary,
  },
  summaryBadgeBilateral: {
    backgroundColor: themas.Colors.gray,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: themas.Colors.text,
  },

  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: themas.Colors.text,
  },
  toggleButton: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: themas.Colors.alternativeBlocks,
    padding: 2,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: themas.Colors.lightGray,
  },
  toggleButtonActive: {
    backgroundColor: themas.Colors.secondary,
    borderColor: themas.Colors.secondary,
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: themas.Colors.text,
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
    paddingHorizontal: 4,
  },

  styledButton: {
    marginTop: 8,
    backgroundColor: themas.Colors.secondary,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
