import { themas } from "@/global/themes";
import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const padding_left = 10

export const styles = StyleSheet.create({
  repsWeightInfo: {
    padding: 5,
  },

  blocks: {
    backgroundColor: themas.Colors.blocks,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 20,
    marginTop: 10,
    marginBottom: 5,
    overflow: "visible",
  },

  name: {
    fontSize: 20,
    fontFamily: "GeologicaBold",
  },

  info: {
    fontSize: 12,
    fontFamily: "GeologicaBold",
    color: themas.Colors.lightGray,
  },

  infoWorkoutWrap: {
    paddingBottom: 15,
    borderBottomColor: themas.Colors.gray,
    gap: 5,
  },

  nameAndMenuWrap: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  exerciseImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    backgroundColor: themas.Colors.text,
  },

  editAndDeleteWrap: {
    position: "absolute",
    width: width * 0.4,
    right: 12,
    top: 0,
    backgroundColor: "#3737376c",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    zIndex: 999,
    elevation: 60,
    shadowColor: "#888888ff",
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  exercisesContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 12,
  },

  exerciseItem: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 20,
  },

  exerciseName: {
    fontSize: 14,
    fontFamily: "GeologicaBold",
    paddingLeft: padding_left
  },

  setsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    width: width / 2.5,
  },

  setItem: {
  paddingLeft: padding_left
  },

  setInfo: {
    fontSize: 12,
    fontFamily: "GeologicaBold",
    color: themas.Colors.gray,
    textAlign: "center",
  },

  set: {
    color: themas.Colors.primary,
  },

  notes: {
    fontSize: 10,
    fontFamily: "GeologicaBold",
    color: themas.Colors.noSelectColor,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 2,
  },

  setsWrapp: {
    marginTop: 8,
    backgroundColor: themas.Colors.blocks,
    width: width,
    marginLeft: -14,
    position: "relative",
    paddingHorizontal: 14
  },
  setsBorder: {
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: themas.Colors.gray
  },
  infoWorkoutWrapp: {
    // backgroundColor: "red",
    width: "75%",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  teste: {
    gap: 10
  }
});
