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
    backgroundColor: themas.Colors.isDoneLine
  },

  setRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 5,
  },

  columnSeries: {
    width: "15%",
    alignItems: "center",
    justifyContent: "center",
  },
  columnWeightAndReps: {
    width: "35%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },

  columnAction: {
    width: "15%",
    alignItems: "center",
    justifyContent: "center",
  },

  doneButton: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themas.Colors.gray,
    borderRadius: "50%",
    height: 30,
    marginLeft: 10,
  },

  alternativeDoneButton: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themas.Colors.alternativeGreen,
    borderRadius: "50%",
    height: 30,
  },

  setLabel: {
    width: 36,
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
    width: "100%",
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
});
