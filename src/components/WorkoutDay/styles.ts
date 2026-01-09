import { themas } from "@/global/themes";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const padding_H = 10;

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
    marginBottom: 8,
  },

  card: {
    backgroundColor: themas.Colors.background,
    borderRadius: 10,
    width: "100%",
    marginBottom: 35,
  },
  microName: {
    fontFamily: "GeologicaRegular",
    fontSize: 14,
    color: themas.Colors.lightGray,
    marginBottom: 2,
  },
  nameWorkout: {
    fontFamily: "GeologicaBold",
    fontSize: 22,
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
    flexDirection: "column",
    // flexWrap: "wrap",
    // justifyContent: "space-between",
  },

  exerciseCard: {
    backgroundColor: themas.Colors.background,
    width: "100%",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "flex-start",
    flexDirection: "row",
  },

  teste: {
    flexDirection: "column",
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
    flexDirection: "column",
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
    right: -padding_H,
    height: 5,
    backgroundColor: themas.Colors.primary,
    marginTop: 10,
  },
});
