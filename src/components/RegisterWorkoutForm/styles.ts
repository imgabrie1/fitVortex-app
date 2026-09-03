import { themas } from "@/global/themes";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const padding_H = 10;

export const styles = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: themas.Colors.background,
    flexDirection: "column",
  },

  headerSets: {
    flexDirection: "row",
    backgroundColor: themas.Colors.background,
    alignItems: "center",
    width: "100%",
    paddingVertical: 5,
  },

  infoHeaderExerciseNotes: {
    flexDirection: "column",
    gap: 10,
    paddingTop: 15,
  },

  infoHeaderExercise: {
    flexDirection: "row",
    alignItems: "center",
    height: height * 0.1,
    gap: 15,
    paddingLeft: 10,
  },

  textCompleted: {
    color: themas.Colors.green,
  },

  badgeDone: {
    backgroundColor: themas.Colors.green,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },

  badgeDoneText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },

  notes: {
    color: themas.Colors.text,
    paddingLeft: padding_H,
  },
  img: {
    borderColor: themas.Colors.gray,
    borderRadius: 4,
    borderWidth: 0.9,
    width: "15%",
    height: "100%",
  },

  imgExerciseDone: {
    borderColor: themas.Colors.green,
    backgroundColor: themas.Colors.isDoneLine,
  },

  setRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 5,
  },

  columnSeries: {
    flex: 0.6,
    alignItems: "center",
    justifyContent: "center",
  },
  columnKg: {
    flex: 1.8,
    alignItems: "center",
    justifyContent: "center",
  },
  columnReps: {
    flex: 0.6,
    alignItems: "center",
    justifyContent: "center",
  },

  columnAction: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  doneButton: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themas.Colors.gray,
    borderRadius: 15,
    height: 30,
  },

  alternativeDoneButton: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themas.Colors.alternativeGreen,
    borderRadius: 15,
    height: 30,
  },

  setLabel: {
    textAlign: "center",
    color: themas.Colors.secondary,
    fontSize: 16,
    fontFamily: "GeologicaBold",
  },

  setUniRight: {
    color: "#046cef",
  },

  setUniLeft: {
    color: themas.Colors.alternativeGreen,
  },

  inputRepsWeight: {
    textAlign: "center",
    textAlignVertical: "center",
    paddingVertical: 6,
    borderRadius: 6,
    color: themas.Colors.text,
    width: 55,
  },

  nameAndSetsWrapp: {
    gap: 8,
  },

  exerciseName: {
    fontSize: 14,
    fontWeight: 700,
  },

  targetSets: {
    fontSize: 14,
    fontWeight: 400,
    color: themas.Colors.lightGray,
    paddingLeft: 2,
  },

  setRepsWeight: {
    color: themas.Colors.text,
    fontFamily: "GeologicaBold",
    fontSize: 12,
  },

  isDoneLine: {
    backgroundColor: themas.Colors.isDoneLine,
  },

  teste: {
    marginBottom: 50,
  },

  button: {
    backgroundColor: themas.Colors.green,
    marginBottom: 10,
  },

  actionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
    gap: 16,
    alignItems: "center",
    width: "100%",
  },
  buttonMain: {
    width: "100%",
    height: 48,
    borderRadius: 8,
    backgroundColor: "#6200EE",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  moreOptionsContainer: {
    width: "100%",
    alignItems: "center",
    gap: 12,
  },
  moreOptionsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 4,
  },
  moreOptionsText: {
    fontSize: 14,
    fontWeight: "bold",
    color: themas.Colors.secondary,
    letterSpacing: 1.25,
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "60%",
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#B00020",
    backgroundColor: "transparent",
  },
  skipButtonText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#B00020",
    letterSpacing: 1.25,
  },
  unilateralToggle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: themas.Colors.gray,
    alignSelf: "flex-start",
    marginTop: 4,
    gap: 4,
  },
  unilateralToggleActive: {
    backgroundColor: themas.Colors.secondary,
    borderColor: themas.Colors.secondary,
  },
  unilateralToggleText: {
    fontSize: 10,
    color: themas.Colors.gray,
    fontWeight: "bold",
  },
  unilateralToggleTextActive: {
    color: "#fff",
  },

  volumeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#4CAF5030",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  invisibleVolumeButton: {
    width: 28,
    height: 28,
    marginRight: 4,
    opacity: 0,
  },
  setNumberContainer: {
    gap: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: themas.Colors.background,
    borderRadius: 20,
    padding: 24,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: themas.Colors.text,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalExerciseInfo: {
    marginBottom: 12,
    padding: 8,
    borderRadius: 8,
  },
  modalExerciseName: {
    fontSize: 14,
    fontWeight: "500",
    color: themas.Colors.gray,
  },
  modalOriginalVolume: {
    backgroundColor: themas.Colors.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: themas.Colors.lightGray,
  },
  modalOriginalLabel: {
    fontSize: 14,
    color: themas.Colors.gray,
    marginBottom: 4,
  },
  modalOriginalValue: {
    fontSize: 18,
    fontWeight: "600",
    color: themas.Colors.text,
  },
  modalSimulationContainer: {
    gap: 16,
  },
  modalSimulationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: themas.Colors.text,
    marginBottom: 8,
  },
  modalInputRow: {
    flexDirection: "row",
    gap: 16,
  },
  modalInputGroup: {
    flex: 1,
  },
  modalInputLabel: {
    fontSize: 14,
    color: themas.Colors.gray,
    marginBottom: 4,
  },
  modalInput: {
    backgroundColor: themas.Colors.alternativeBlocks,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: themas.Colors.text,
    borderWidth: 1,
    borderColor: themas.Colors.lightGray,
  },
  modalResultContainer: {
    backgroundColor: themas.Colors.background,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: themas.Colors.lightGray,
  },
  modalResultLabel: {
    fontSize: 14,
    color: themas.Colors.gray,
    marginBottom: 4,
  },
  modalResultValue: {
    fontSize: 18,
    fontWeight: "600",
    color: themas.Colors.text,
  },
  modalComparisonContainer: {
    marginTop: 12,
  },
  modalStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  modalStatusTextContainer: {
    flex: 1,
  },
  modalStatusText: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalStatusSubtext: {
    fontSize: 14,
    marginTop: 2,
  },
  modalPercentageText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
  },
  modalConfirmButton: {
    backgroundColor: themas.Colors.secondary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  modalConfirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  modalVolumeResult: {
    backgroundColor: themas.Colors.background,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: themas.Colors.gray,
  },
  modalVolumeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalVolumeLabel: {
    fontSize: 14,
    color: themas.Colors.gray,
  },
  modalPercentageBadge: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  modalVolumeValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  modalVolumeDifference: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
    textAlign: "right",
  },

  modalButtonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelButton: {
    backgroundColor: themas.Colors.alternativeBlocks,
    borderWidth: 1,
    borderColor: themas.Colors.lightGray,
  },
  modalCancelButtonText: {
    color: themas.Colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  modalApplyButton: {
    backgroundColor: themas.Colors.secondary,
  },
  modalApplyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  
});
