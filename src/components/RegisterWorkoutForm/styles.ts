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
    paddingLeft: 10
  },

  notes: {
    color: themas.Colors.text,
    paddingLeft: padding_H

  },
  img: {
    borderColor: themas.Colors.gray,
    borderRadius: 4,
    borderWidth: 0.9,
    width: "15%",
    height: "100%",
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
    marginLeft: 10
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
    backgroundColor: themas.Colors.green,
  },

  teste: {
    marginBottom: 50
  },

  button: {
    marginBottom: 10,
  },
});
