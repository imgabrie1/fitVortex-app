import { themas } from "@/global/themes";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const padding_H = 10

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: themas.Colors.background,
    padding: padding_H,
  },

  nameWhenWrap: {
    backgroundColor: themas.Colors.background,
    display: "flex",
    flexDirection: "column",
    marginBottom: 15,
  },

  card: {
    backgroundColor: themas.Colors.background,
    borderRadius: 10,
    width: "100%",
    marginBottom: 35,
  },

  nameWorkout: {
    fontFamily: "GeologicaBold",
    fontSize: 20,
    fontWeight: "400",
  },

  setsDurationWrap: {
    backgroundColor: themas.Colors.background,
    display: "flex",
    flexDirection: "row",
    gap: 25,
  },

  bottomInfoWrap: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  bottomInfo: {
    fontWeight: "700",
    fontSize: 14,
    color: themas.Colors.text,
  },

  bottomInfoValue: {
    color: themas.Colors.lightGray,
  },

  headerInfo: {
    backgroundColor: themas.Colors.background,
    marginBottom: 20,
    paddingBottom: 15,
    borderWidth: 1,
    borderBottomColor: themas.Colors.noSelectColor,
  },

  dayText: {
    backgroundColor: themas.Colors.background,
    fontWeight: "400",
    fontSize: 16,
    color: themas.Colors.lightGray,
  },

  exercisesContainer: {
    backgroundColor: themas.Colors.background,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  exerciseCard: {
    backgroundColor: themas.Colors.background,
    width: "48%",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },

  exerciseImage: {
    backgroundColor: themas.Colors.background,
    width: 80,
    height: 80,
    marginBottom: 5,
    borderRadius: 8,
  },

  nameExercise: {
    marginTop: 8,
    fontSize: 16,
  },

  infoSetsWrap: {
    display: "flex",
    flexDirection: "row",
    marginTop: 8,
  },

  infoSets: {
    fontSize: 12,
    color: themas.Colors.gray,
  },

  separatorWrapper: {
    position: "relative",
    width: "100%",
  },
  separator: {
    position: "absolute",
    left: -padding_H,
    right:-padding_H,
    height: 5,
    backgroundColor: themas.Colors.primary,
    marginTop: 10
  },
});
