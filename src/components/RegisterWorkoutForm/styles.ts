import { themas } from "@/global/themes";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const padding_H = 10;

export const styles = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: themas.Colors.background,
    padding: padding_H,
    flexDirection: "column",
    paddingBottom: 80,
  },

  ulContainer: {
    paddingBottom: 50,
  },

  headerSets: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: themas.Colors.background,
    justifyContent: "space-evenly",
    gap: "35%"
  },

  infoHeaderExerciseNotes: {
    paddingBottom: 15,
    flexDirection: "column",
    gap: 10
  },

  infoHeaderExercise: {
    flexDirection: "row",
    alignItems: "center",
    height: height * 0.1,
    gap: 15
  },

  notes: {
    color: themas.Colors.text,
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
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    width: "100%",
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
    color: "#04ef6eff",
  },

  inputRepsWeight: {
    width: "12%",
    minWidth: 48,
    textAlign: "center",
    textAlignVertical: "center",
    paddingVertical: 6,
    borderRadius: 6,
    color: themas.Colors.text,

  },

  exerciseName: {
    fontSize: 14,
    fontWeight: 700,
  },

  targetSets: {
    fontSize: 14,
    color: themas.Colors.lightGray
  },

  setRepsWeight: {
    color: themas.Colors.text,
    fontFamily: "GeologicaBold",
    fontSize: 12
  },
});
